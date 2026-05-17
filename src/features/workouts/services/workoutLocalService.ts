import { getDb } from "@/src/lib/db";
import type { Exercise, Workout } from "../types";

export function listWorkouts(userId: string): Workout[] {
  const db = getDb();
  const workoutRows = db.getAllSync<{
    id: string;
    user_id: string;
    name: string;
    created_at: string;
    updated_at: string;
  }>(
    "SELECT * FROM user_workouts WHERE user_id = ? ORDER BY created_at DESC",
    [userId]
  );

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
      name: w.name,
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
      db.runSync(
        `INSERT OR REPLACE INTO user_workouts (id, user_id, name, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?)`,
        [w.id, w.userId, w.name, w.createdAt, w.updatedAt]
      );
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

export function insertWorkoutLocal(workout: Workout): void {
  const db = getDb();
  db.withTransactionSync(() => {
    db.runSync(
      `INSERT INTO user_workouts (id, user_id, name, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?)`,
      [workout.id, workout.userId, workout.name, workout.createdAt, workout.updatedAt]
    );
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
