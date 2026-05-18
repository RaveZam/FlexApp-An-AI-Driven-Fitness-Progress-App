import { getDb } from "@/src/lib/db";
import type { Workout, WorkoutPlan } from "../types";

function readDaysForWorkouts(workoutIds: string[]): Map<string, number[]> {
  const map = new Map<string, number[]>();
  if (workoutIds.length === 0) return map;
  const db = getDb();
  const placeholders = workoutIds.map(() => "?").join(",");
  const rows = db.getAllSync<{ workout_id: string; day_of_week: number }>(
    `SELECT workout_id, day_of_week FROM user_workout_days WHERE workout_id IN (${placeholders}) ORDER BY day_of_week ASC`,
    workoutIds
  );
  for (const r of rows) {
    const existing = map.get(r.workout_id);
    if (existing) existing.push(r.day_of_week);
    else map.set(r.workout_id, [r.day_of_week]);
  }
  return map;
}

function writeDaysForWorkout(
  workoutId: string,
  daysOfWeek: number[],
  now: string
): void {
  const db = getDb();
  db.runSync("DELETE FROM user_workout_days WHERE workout_id = ?", [workoutId]);
  for (const d of daysOfWeek) {
    db.runSync(
      "INSERT OR IGNORE INTO user_workout_days (workout_id, day_of_week, created_at) VALUES (?, ?, ?)",
      [workoutId, d, now]
    );
  }
}

export function listPlans(userId: string): WorkoutPlan[] {
  const db = getDb();
  const planRows = db.getAllSync<{
    id: string;
    user_id: string;
    name: string;
    created_at: string;
    updated_at: string;
  }>(
    "SELECT * FROM user_workout_plans WHERE user_id = ? ORDER BY created_at DESC",
    [userId]
  );

  return planRows.map((p) => {
    const workoutRows = db.getAllSync<{
      id: string;
      user_id: string;
      plan_id: string;
      name: string;
      created_at: string;
      updated_at: string;
    }>(
      "SELECT * FROM user_workouts WHERE plan_id = ? ORDER BY created_at ASC",
      [p.id]
    );

    const daysByWorkout = readDaysForWorkouts(workoutRows.map((w) => w.id));

    const workouts: Workout[] = workoutRows.map((w) => {
      const exercises = db.getAllSync<{
        id: string;
        workout_id: string;
        user_id: string;
        name: string;
        catalog_exercise_id: string | null;
        target_sets: number;
        target_reps: number;
        position: number;
        created_at: string;
      }>(
        "SELECT * FROM user_workout_exercises WHERE workout_id = ? ORDER BY position ASC",
        [w.id]
      );

      return {
        id: w.id,
        userId: w.user_id,
        planId: w.plan_id,
        name: w.name,
        daysOfWeek: daysByWorkout.get(w.id) ?? [],
        createdAt: w.created_at,
        updatedAt: w.updated_at,
        exercises: exercises.map((e) => ({
          id: e.id,
          workoutId: e.workout_id,
          userId: e.user_id,
          name: e.name,
          catalogExerciseId: e.catalog_exercise_id,
          targetSets: e.target_sets,
          targetReps: e.target_reps,
          position: e.position,
          createdAt: e.created_at,
        })),
      };
    });

    return {
      id: p.id,
      userId: p.user_id,
      name: p.name,
      createdAt: p.created_at,
      updatedAt: p.updated_at,
      workouts,
    };
  });
}

export function insertPlanLocal(plan: WorkoutPlan): void {
  const db = getDb();
  db.runSync(
    "INSERT INTO user_workout_plans (id, user_id, name, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
    [plan.id, plan.userId, plan.name, plan.createdAt, plan.updatedAt]
  );
}

export function upsertPlans(plans: WorkoutPlan[]): void {
  const db = getDb();
  db.withTransactionSync(() => {
    for (const p of plans) {
      db.runSync(
        `INSERT INTO user_workout_plans (id, user_id, name, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?)
         ON CONFLICT(id) DO UPDATE SET
           name = excluded.name,
           updated_at = excluded.updated_at
         WHERE excluded.updated_at >= user_workout_plans.updated_at`,
        [p.id, p.userId, p.name, p.createdAt, p.updatedAt]
      );
      for (const w of p.workouts) {
        const existing = db.getFirstSync<{ updated_at: string }>(
          "SELECT updated_at FROM user_workouts WHERE id = ?",
          [w.id]
        );
        const remoteIsNewer = !existing || w.updatedAt >= existing.updated_at;

        db.runSync(
          `INSERT INTO user_workouts (id, user_id, plan_id, name, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?)
           ON CONFLICT(id) DO UPDATE SET
             plan_id = excluded.plan_id,
             name = excluded.name,
             updated_at = excluded.updated_at
           WHERE excluded.updated_at >= user_workouts.updated_at`,
          [w.id, w.userId, w.planId, w.name, w.createdAt, w.updatedAt]
        );
        if (remoteIsNewer) {
          writeDaysForWorkout(w.id, w.daysOfWeek, w.updatedAt);
        }
        for (const e of w.exercises) {
          db.runSync(
            `INSERT OR REPLACE INTO user_workout_exercises
             (id, workout_id, user_id, name, catalog_exercise_id, target_sets, target_reps, position, created_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [e.id, e.workoutId, e.userId, e.name, e.catalogExerciseId ?? null, e.targetSets, e.targetReps, e.position, e.createdAt]
          );
        }
      }
    }
  });
}

export function listWorkouts(userId: string): Workout[] {
  const db = getDb();
  const workoutRows = db.getAllSync<{
    id: string;
    user_id: string;
    plan_id: string;
    name: string;
    created_at: string;
    updated_at: string;
  }>(
    "SELECT * FROM user_workouts WHERE user_id = ? ORDER BY created_at DESC",
    [userId]
  );

  const daysByWorkout = readDaysForWorkouts(workoutRows.map((w) => w.id));

  return workoutRows.map((w) => {
    const exercises = db.getAllSync<{
      id: string;
      workout_id: string;
      user_id: string;
      name: string;
      catalog_exercise_id: string | null;
      target_sets: number;
      target_reps: number;
      position: number;
      created_at: string;
    }>(
      "SELECT * FROM user_workout_exercises WHERE workout_id = ? ORDER BY position ASC",
      [w.id]
    );

    return {
      id: w.id,
      userId: w.user_id,
      planId: w.plan_id,
      name: w.name,
      daysOfWeek: daysByWorkout.get(w.id) ?? [],
      createdAt: w.created_at,
      updatedAt: w.updated_at,
      exercises: exercises.map((e) => ({
        id: e.id,
        workoutId: e.workout_id,
        userId: e.user_id,
        name: e.name,
        catalogExerciseId: e.catalog_exercise_id,
        targetSets: e.target_sets,
        targetReps: e.target_reps,
        position: e.position,
        createdAt: e.created_at,
      })),
    };
  });
}

export function upsertWorkouts(workouts: Workout[]): void {
  const db = getDb();
  db.withTransactionSync(() => {
    for (const w of workouts) {
      const existing = db.getFirstSync<{ updated_at: string }>(
        "SELECT updated_at FROM user_workouts WHERE id = ?",
        [w.id]
      );
      const remoteIsNewer = !existing || w.updatedAt >= existing.updated_at;

      db.runSync(
        `INSERT INTO user_workouts (id, user_id, plan_id, name, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?)
         ON CONFLICT(id) DO UPDATE SET
           plan_id = excluded.plan_id,
           name = excluded.name,
           updated_at = excluded.updated_at
         WHERE excluded.updated_at >= user_workouts.updated_at`,
        [w.id, w.userId, w.planId, w.name, w.createdAt, w.updatedAt]
      );
      if (remoteIsNewer) {
        writeDaysForWorkout(w.id, w.daysOfWeek, w.updatedAt);
      }
      for (const e of w.exercises) {
        db.runSync(
          `INSERT OR REPLACE INTO user_workout_exercises
           (id, workout_id, user_id, name, catalog_exercise_id, target_sets, target_reps, position, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [e.id, e.workoutId, e.userId, e.name, e.catalogExerciseId ?? null, e.targetSets, e.targetReps, e.position, e.createdAt]
        );
      }
    }
  });
}

export function updateWorkoutDays(workoutId: string, daysOfWeek: number[]): void {
  const db = getDb();
  const now = new Date().toISOString();
  db.withTransactionSync(() => {
    writeDaysForWorkout(workoutId, daysOfWeek, now);
    db.runSync(
      "UPDATE user_workouts SET updated_at = ? WHERE id = ?",
      [now, workoutId]
    );
  });
}

export function insertWorkoutLocal(workout: Workout): void {
  const db = getDb();
  db.withTransactionSync(() => {
    db.runSync(
      `INSERT INTO user_workouts (id, user_id, plan_id, name, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [workout.id, workout.userId, workout.planId, workout.name, workout.createdAt, workout.updatedAt]
    );
    writeDaysForWorkout(workout.id, workout.daysOfWeek, workout.createdAt);
    for (const e of workout.exercises) {
      db.runSync(
        `INSERT INTO user_workout_exercises
         (id, workout_id, user_id, name, catalog_exercise_id, target_sets, target_reps, position, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [e.id, e.workoutId, e.userId, e.name, e.catalogExerciseId ?? null, e.targetSets, e.targetReps, e.position, e.createdAt]
      );
    }
  });
}
