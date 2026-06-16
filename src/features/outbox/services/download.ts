import type { SessionStatus } from "@/src/lib/dao/sessions";
import * as catalogDao from "@/src/lib/dao/catalog";
import * as plansDao from "@/src/lib/dao/plans";
import * as preferencesDao from "@/src/lib/dao/preferences";
import * as sessionExercisesDao from "@/src/lib/dao/sessionExercises";
import * as sessionSetsDao from "@/src/lib/dao/sessionSets";
import * as sessionsDao from "@/src/lib/dao/sessions";
import * as daysDao from "@/src/lib/dao/workoutDays";
import * as workoutExercisesDao from "@/src/lib/dao/workoutExercises";
import * as workoutsDao from "@/src/lib/dao/workouts";
import { isWifiConnected } from "@/src/lib/network";
import { supabase } from "@/src/lib/supabase";

// Pulls all of a user's remote data into local SQLite. Mirror of runOutboxSync.
// Parents use newest-wins (remote applied only if newer than local); when a
// parent is applied its children are replaced wholesale.
export async function runDownloadSync(userId: string): Promise<void> {
  const hasNetwork = await isWifiConnected();
  if (!hasNetwork) return;

  await downloadCatalog();
  await downloadPlans(userId);
  await downloadWorkouts(userId);
  await downloadPreferences(userId);
  await downloadSessions(userId);
}

// Global reference data — one-way pull, not scoped to a user.
async function downloadCatalog(): Promise<void> {
  try {
    const { data, error } = await supabase
      .from("exercises_catalog")
      .select("id, name, muscle_group, description, is_unilateral");
    if (error) throw error;

    catalogDao.upsertManyCatalogExercises(
      (data ?? []).map((row) => ({
        id: row.id,
        name: row.name,
        muscleGroup: row.muscle_group,
        description: row.description,
        isUnilateral: row.is_unilateral ?? false,
      }))
    );
  } catch {
    // Non-fatal: catalog stays at its last cached state.
  }
}

async function downloadPlans(userId: string): Promise<void> {
  try {
    const { data, error } = await supabase
      .from("user_workout_plans")
      .select("id, user_id, name, created_at, updated_at")
      .eq("user_id", userId);
    if (error) throw error;

    for (const row of data ?? []) {
      // upsert is guarded by `excluded.updated_at >= updated_at` in SQL.
      plansDao.upsertPlan({
        id: row.id,
        userId: row.user_id,
        name: row.name,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      });
    }
  } catch {}
}

async function downloadWorkouts(userId: string): Promise<void> {
  try {
    const { data: workouts, error } = await supabase
      .from("user_workouts")
      .select("id, user_id, plan_id, name, created_at, updated_at")
      .eq("user_id", userId);
    if (error) throw error;
    if (!workouts || workouts.length === 0) return;

    // Decide which workouts are newer than local before touching children.
    const applied = workouts.filter((w) => {
      const localUpdatedAt = workoutsDao.getWorkoutUpdatedAt(w.id);
      return !localUpdatedAt || w.updated_at > localUpdatedAt;
    });

    for (const w of applied) {
      workoutsDao.upsertWorkout({
        id: w.id,
        userId: w.user_id,
        planId: w.plan_id ?? "",
        name: w.name,
        createdAt: w.created_at,
        updatedAt: w.updated_at,
      });
    }

    if (applied.length === 0) return;
    const appliedIds = applied.map((w) => w.id);

    const { data: exercises, error: exErr } = await supabase
      .from("user_workout_exercises")
      .select(
        "id, workout_id, user_id, name, catalog_exercise_id, target_sets, target_reps, position, is_unilateral, created_at"
      )
      .in("workout_id", appliedIds);
    if (exErr) throw exErr;

    const { data: days, error: daysErr } = await supabase
      .from("user_workout_days")
      .select("workout_id, day_of_week")
      .in("workout_id", appliedIds);
    if (daysErr) throw daysErr;

    const now = new Date().toISOString();
    for (const workoutId of appliedIds) {
      workoutExercisesDao.deleteWorkoutExercisesByWorkout(workoutId);
      const workoutExercises = (exercises ?? []).filter((e) => e.workout_id === workoutId);
      for (const e of workoutExercises) {
        workoutExercisesDao.insertWorkoutExercise({
          id: e.id,
          workoutId: e.workout_id,
          userId: e.user_id,
          name: e.name,
          catalogExerciseId: e.catalog_exercise_id,
          targetSets: e.target_sets,
          targetReps: e.target_reps,
          position: e.position,
          isUnilateral: e.is_unilateral ?? false,
          createdAt: e.created_at,
        });
      }

      const workoutDays = (days ?? [])
        .filter((d) => d.workout_id === workoutId)
        .map((d) => d.day_of_week);
      daysDao.replaceWorkoutDays(workoutId, workoutDays, now);
    }
  } catch {}
}

async function downloadPreferences(userId: string): Promise<void> {
  try {
    const { data, error } = await supabase
      .from("user_preferences")
      .select("user_id, active_plan_id, rest_timer_seconds, updated_at")
      .eq("user_id", userId)
      .maybeSingle();
    if (error) throw error;
    if (!data) return;

    const local = preferencesDao.getPreferencesForUser(userId);
    if (local && data.updated_at <= local.updatedAt) return;

    preferencesDao.upsertPreferencesFromRemote({
      userId: data.user_id,
      activePlanId: data.active_plan_id,
      restTimerSeconds: data.rest_timer_seconds,
      updatedAt: data.updated_at,
    });
  } catch {}
}

async function downloadSessions(userId: string): Promise<void> {
  try {
    const { data: sessions, error } = await supabase
      .from("workout_sessions")
      .select(
        "id, user_id, workout_id, plan_id, name, status, started_at, completed_at, created_at, updated_at"
      )
      .eq("user_id", userId);
    if (error) throw error;
    if (!sessions || sessions.length === 0) return;

    const applied = sessions.filter((s) => {
      const local = sessionsDao.getSessionById(s.id);
      return !local || s.updated_at > local.updatedAt;
    });
    if (applied.length === 0) return;

    for (const s of applied) {
      // Removing first cascades old children; insert re-creates the row clean.
      if (sessionsDao.getSessionById(s.id)) sessionsDao.deleteSession(s.id);
      sessionsDao.insertSession({
        id: s.id,
        userId: s.user_id,
        workoutId: s.workout_id,
        planId: s.plan_id,
        name: s.name,
        status: s.status as SessionStatus,
        startedAt: s.started_at,
        completedAt: s.completed_at,
        createdAt: s.created_at,
        updatedAt: s.updated_at,
      });
    }

    const appliedIds = applied.map((s) => s.id);

    const { data: exercises, error: exErr } = await supabase
      .from("session_exercises")
      .select(
        "id, session_id, source_exercise_id, catalog_exercise_id, name, target_sets, target_reps, position, is_unilateral"
      )
      .in("session_id", appliedIds);
    if (exErr) throw exErr;

    const exerciseIds = (exercises ?? []).map((e) => e.id);
    const { data: sets, error: setsErr } = exerciseIds.length
      ? await supabase
          .from("session_sets")
          .select(
            "id, session_exercise_id, set_index, target_reps, actual_reps, actual_reps_left, actual_reps_right, weight, completed, completed_at"
          )
          .in("session_exercise_id", exerciseIds)
      : { data: [], error: null };
    if (setsErr) throw setsErr;

    for (const e of exercises ?? []) {
      sessionExercisesDao.insertSessionExercise({
        id: e.id,
        sessionId: e.session_id,
        sourceExerciseId: e.source_exercise_id,
        catalogExerciseId: e.catalog_exercise_id,
        name: e.name,
        targetSets: e.target_sets,
        targetReps: e.target_reps,
        position: e.position,
        isUnilateral: e.is_unilateral ?? false,
      });
    }

    for (const s of sets ?? []) {
      sessionSetsDao.insertSessionSet({
        id: s.id,
        sessionExerciseId: s.session_exercise_id,
        setIndex: s.set_index,
        targetReps: s.target_reps,
      });
      sessionSetsDao.updateSessionSet({
        id: s.id,
        actualReps: s.actual_reps,
        actualRepsLeft: s.actual_reps_left ?? null,
        actualRepsRight: s.actual_reps_right ?? null,
        weight: s.weight,
        completed: s.completed,
        completedAt: s.completed_at,
      });
    }
  } catch {}
}
