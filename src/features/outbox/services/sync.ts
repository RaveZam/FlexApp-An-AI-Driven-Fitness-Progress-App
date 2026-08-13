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

    if (row.operation === "update") {
      const { name, updated_at } = payload as {
        name: string;
        updated_at: string;
      };
      const { error } = await supabase
        .from("user_workout_plans")
        .update({ name, updated_at })
        .eq("id", row.entity_id);
      if (error) throw error;
    }

    if (row.operation === "delete") {
      const { error: workoutsError } = await supabase
        .from("user_workouts")
        .delete()
        .eq("plan_id", row.entity_id);
      if (workoutsError) throw workoutsError;

      const { error } = await supabase
        .from("user_workout_plans")
        .delete()
        .eq("id", row.entity_id);
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
      [row.entity_id],
    );
    if (!local) return;
    const { error } = await supabase.from("user_preferences").upsert(
      {
        user_id: row.entity_id,
        active_plan_id: local.active_plan_id,
        rest_timer_seconds: local.rest_timer_seconds,
        updated_at: local.updated_at,
      },
      { onConflict: "user_id" },
    );
    if (error) throw error;
  }

  if (row.entity_type === "workout_session") {
    if (row.operation === "create") {
      const {
        sessionId,
        userId,
        workoutId,
        planId,
        name,
        startedAt,
        exercises,
      } = payload as {
        sessionId: string;
        userId: string;
        workoutId: string;
        planId: string | null;
        name: string;
        startedAt: string;
        exercises: {
          id: string;
          sourceExerciseId: string | null;
          catalogExerciseId: string | null;
          name: string;
          targetSets: number;
          targetReps: number;
          position: number;
          isUnilateral: boolean;
          sets: { id: string; setIndex: number; targetReps: number }[];
        }[];
      };
      const { error } = await supabase.from("workout_sessions").upsert(
        {
          id: sessionId,
          user_id: userId,
          workout_id: workoutId,
          plan_id: planId,
          name,
          status: "in_progress",
          started_at: startedAt,
          created_at: startedAt,
          updated_at: startedAt,
        },
        { onConflict: "id" },
      );
      if (error) throw error;

      if (exercises.length > 0) {
        const { error: exErr } = await supabase
          .from("session_exercises")
          .upsert(
            exercises.map((ex) => ({
              id: ex.id,
              session_id: sessionId,
              source_exercise_id: ex.sourceExerciseId,
              catalog_exercise_id: ex.catalogExerciseId,
              name: ex.name,
              target_sets: ex.targetSets,
              target_reps: ex.targetReps,
              position: ex.position,
              is_unilateral: ex.isUnilateral,
            })),
            { onConflict: "id" },
          );
        if (exErr) throw exErr;

        const setRows = exercises.flatMap((ex) =>
          ex.sets.map((s) => ({
            id: s.id,
            session_exercise_id: ex.id,
            set_index: s.setIndex,
            target_reps: s.targetReps,
            actual_reps: null,
            actual_reps_left: null,
            actual_reps_right: null,
            weight: null,
            completed: false,
            completed_at: null,
          })),
        );

        if (setRows.length > 0) {
          const { error: setsErr } = await supabase
            .from("session_sets")
            .upsert(setRows, { onConflict: "id" });
          if (setsErr) throw setsErr;
        }
      }
    }
    if (row.operation === "update") {
      const { status, completedAt } = payload as {
        status: string;
        completedAt: string;
      };
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
    const {
      actualReps,
      actualRepsLeft,
      actualRepsRight,
      weight,
      completed,
      completedAt,
    } = payload as {
      actualReps: number | null;
      actualRepsLeft: number | null;
      actualRepsRight: number | null;
      weight: number | null;
      completed: boolean;
      completedAt: string | null;
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
    "SELECT id, entity_type, entity_id, operation, payload FROM outbox WHERE synced_at IS NULL ORDER BY created_at ASC",
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

  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) return;

  const pending = getPendingRows();
  if (pending.length === 0) return;

  for (const row of pending) {
    try {
      await dispatchRow(row);
      markSynced(row.id);
    } catch (err) {
      // leave the row pending so it retries; surface why for offline debugging
      console.warn(
        `Outbox sync failed for ${row.entity_type}/${row.entity_id} (${row.operation}): ${
          err instanceof Error ? err.message : String(err)
        }`,
      );
    }
  }
}
