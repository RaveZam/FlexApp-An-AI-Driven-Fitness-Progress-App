import { getDb } from "@/src/lib/db";
import { isWifiConnected } from "@/src/lib/network";
import { supabase } from "@/src/lib/supabase";

type OutboxRow = {
  id: string;
  entity_type: string;
  entity_id: string;
  operation: "create" | "update" | "delete";
  payload: string;
};

async function dispatchRow(row: OutboxRow): Promise<void> {
  const payload = JSON.parse(row.payload);

  if (row.entity_type === "workout_plan") {
    if (row.operation === "create") {
      const { plan } = payload as { plan: Record<string, unknown> };
      const { error } = await supabase
        .from("user_workout_plans")
        .upsert(plan, { onConflict: "id" });
      if (error) throw error;
    }
  }

  if (row.entity_type === "workout") {
    if (row.operation === "update") {
      const { workout } = payload as { workout: Record<string, unknown> };
      const { error } = await supabase
        .from("user_workouts")
        .update(workout)
        .eq("id", row.entity_id);
      if (error) throw error;
    }

    if (row.operation === "create") {
      const { workout, exercises, days } = payload as {
        workout: Record<string, unknown>;
        exercises: Record<string, unknown>[];
        days?: number[];
      };

      const { error: workoutError } = await supabase
        .from("user_workouts")
        .upsert(workout, { onConflict: "id" });
      if (workoutError) throw workoutError;

      if (exercises?.length) {
        const { error: exercisesError } = await supabase
          .from("user_workout_exercises")
          .upsert(exercises, { onConflict: "id" });
        if (exercisesError) throw exercisesError;
      }

      if (days?.length) {
        const dayRows = days.map((d) => ({
          workout_id: row.entity_id,
          day_of_week: d,
        }));
        const { error: daysError } = await supabase
          .from("user_workout_days")
          .upsert(dayRows, { onConflict: "workout_id,day_of_week" });
        if (daysError) throw daysError;
      }
    }
  }

  if (row.entity_type === "workout_exercise") {
    if (row.operation === "create") {
      const { exercise } = payload as { exercise: Record<string, unknown> };
      const { error } = await supabase
        .from("user_workout_exercises")
        .upsert(exercise, { onConflict: "id" });
      if (error) throw error;
    }
    if (row.operation === "update") {
      const { targetSets, targetReps } = payload as {
        targetSets: number;
        targetReps: number;
      };
      const { error } = await supabase
        .from("user_workout_exercises")
        .update({ target_sets: targetSets, target_reps: targetReps })
        .eq("id", row.entity_id);
      if (error) throw error;
    }
    if (row.operation === "delete") {
      const { error } = await supabase
        .from("user_workout_exercises")
        .delete()
        .eq("id", row.entity_id);
      if (error) throw error;
    }
  }

  if (row.entity_type === "user_preferences" && row.operation === "update") {
    const local = getDb().getFirstSync<{
      active_plan_id: string | null;
      rest_timer_seconds: number;
      updated_at: string;
    }>(
      "SELECT active_plan_id, rest_timer_seconds, updated_at FROM user_preferences WHERE user_id = ?",
      [row.entity_id]
    );
    if (!local) return;
    const { error } = await supabase
      .from("user_preferences")
      .upsert(
        {
          user_id: row.entity_id,
          active_plan_id: local.active_plan_id,
          rest_timer_seconds: local.rest_timer_seconds,
          updated_at: local.updated_at,
        },
        { onConflict: "user_id" }
      );
    if (error) throw error;
  }

  if (row.entity_type === "workout_session") {
    if (row.operation === "create") {
      const { sessionId, userId, workoutId, planId, name, startedAt } = payload as {
        sessionId: string; userId: string; workoutId: string; planId: string | null;
        name: string; startedAt: string;
      };
      const { error } = await supabase
        .from("workout_sessions")
        .upsert(
          { id: sessionId, user_id: userId, workout_id: workoutId, plan_id: planId, name, status: "in_progress", started_at: startedAt, created_at: startedAt, updated_at: startedAt },
          { onConflict: "id" }
        );
      if (error) throw error;

      const db = getDb();
      const exerciseRows = db.getAllSync<{
        id: string; session_id: string; source_exercise_id: string | null;
        catalog_exercise_id: string | null; name: string; target_sets: number;
        target_reps: number; position: number; is_unilateral: number;
      }>("SELECT * FROM session_exercises WHERE session_id = ? ORDER BY position ASC", [sessionId]);

      if (exerciseRows.length > 0) {
        const { error: exErr } = await supabase.from("session_exercises").upsert(
          exerciseRows.map((ex) => ({
            id: ex.id, session_id: ex.session_id, source_exercise_id: ex.source_exercise_id,
            catalog_exercise_id: ex.catalog_exercise_id, name: ex.name,
            target_sets: ex.target_sets, target_reps: ex.target_reps, position: ex.position,
            is_unilateral: ex.is_unilateral === 1,
          })),
          { onConflict: "id" }
        );
        if (exErr) throw exErr;

        for (const ex of exerciseRows) {
          const setRows = db.getAllSync<{
            id: string; session_exercise_id: string; set_index: number; target_reps: number;
            actual_reps: number | null; actual_reps_left: number | null; actual_reps_right: number | null;
            weight: number | null; completed: number; completed_at: string | null;
          }>("SELECT * FROM session_sets WHERE session_exercise_id = ? ORDER BY set_index ASC", [ex.id]);

          if (setRows.length > 0) {
            const { error: setsErr } = await supabase.from("session_sets").upsert(
              setRows.map((s) => ({
                id: s.id, session_exercise_id: s.session_exercise_id, set_index: s.set_index,
                target_reps: s.target_reps, actual_reps: s.actual_reps,
                actual_reps_left: s.actual_reps_left, actual_reps_right: s.actual_reps_right,
                weight: s.weight, completed: s.completed === 1, completed_at: s.completed_at,
              })),
              { onConflict: "id" }
            );
            if (setsErr) throw setsErr;
          }
        }
      }
    }
    if (row.operation === "update") {
      const { status, completedAt } = payload as { status: string; completedAt: string };
      const { error } = await supabase
        .from("workout_sessions")
        .update({ status, completed_at: completedAt, updated_at: completedAt })
        .eq("id", row.entity_id);
      if (error) throw error;
    }
    if (row.operation === "delete") {
      const { error } = await supabase
        .from("workout_sessions")
        .delete()
        .eq("id", row.entity_id);
      if (error) throw error;
    }
  }

  if (row.entity_type === "session_set" && row.operation === "update") {
    const { actualReps, actualRepsLeft, actualRepsRight, weight, completed, completedAt } = payload as {
      actualReps: number | null; actualRepsLeft: number | null; actualRepsRight: number | null;
      weight: number | null; completed: boolean; completedAt: string | null;
    };
    const { error } = await supabase
      .from("session_sets")
      .update({
        actual_reps: actualReps,
        actual_reps_left: actualRepsLeft ?? null,
        actual_reps_right: actualRepsRight ?? null,
        weight,
        completed,
        completed_at: completedAt,
      })
      .eq("id", row.entity_id);
    if (error) throw error;
  }

  if (row.entity_type === "workout_days" && row.operation === "update") {
    const { days, updated_at } = payload as {
      days: number[];
      updated_at: string;
    };

    const { error: deleteError } = await supabase
      .from("user_workout_days")
      .delete()
      .eq("workout_id", row.entity_id);
    if (deleteError) throw deleteError;

    if (days.length) {
      const dayRows = days.map((d) => ({
        workout_id: row.entity_id,
        day_of_week: d,
      }));
      const { error: insertError } = await supabase
        .from("user_workout_days")
        .insert(dayRows);
      if (insertError) throw insertError;
    }

    const { error: touchError } = await supabase
      .from("user_workouts")
      .update({ updated_at })
      .eq("id", row.entity_id);
    if (touchError) throw touchError;
  }
}

function getPendingRows(): OutboxRow[] {
  const db = getDb();
  return db.getAllSync<OutboxRow>(
    "SELECT id, entity_type, entity_id, operation, payload FROM outbox WHERE synced_at IS NULL ORDER BY created_at ASC"
  );
}

function markSynced(id: string): void {
  const db = getDb();
  db.runSync("UPDATE outbox SET synced_at = ? WHERE id = ?", [
    new Date().toISOString(),
    id,
  ]);
}

export async function runOutboxSync(): Promise<void> {
  const hasNetwork = await isWifiConnected();
  if (!hasNetwork) return;

  const pending = getPendingRows();
  if (pending.length === 0) return;

  for (const row of pending) {
    try {
      await dispatchRow(row);
      markSynced(row.id);
    } catch (err) {
      console.error(`[outbox] failed to sync ${row.entity_type}/${row.operation} ${row.entity_id}:`, err);
    }
  }
}
