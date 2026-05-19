import { getDb } from "@/src/lib/db";

export type WorkoutExerciseRow = {
  id: string;
  workoutId: string;
  userId: string;
  name: string;
  catalogExerciseId: string | null;
  targetSets: number;
  targetReps: number;
  position: number;
  createdAt: string;
};

type Raw = {
  id: string;
  workout_id: string;
  user_id: string;
  name: string;
  catalog_exercise_id: string | null;
  target_sets: number;
  target_reps: number;
  position: number;
  created_at: string;
};

const fromRaw = (r: Raw): WorkoutExerciseRow => ({
  id: r.id,
  workoutId: r.workout_id,
  userId: r.user_id,
  name: r.name,
  catalogExerciseId: r.catalog_exercise_id,
  targetSets: r.target_sets,
  targetReps: r.target_reps,
  position: r.position,
  createdAt: r.created_at,
});

export function listByWorkout(workoutId: string): WorkoutExerciseRow[] {
  return getDb()
    .getAllSync<Raw>(
      "SELECT * FROM user_workout_exercises WHERE workout_id = ? ORDER BY position ASC",
      [workoutId]
    )
    .map(fromRaw);
}

export function insert(ex: WorkoutExerciseRow): void {
  getDb().runSync(
    `INSERT INTO user_workout_exercises
     (id, workout_id, user_id, name, catalog_exercise_id, target_sets, target_reps, position, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      ex.id,
      ex.workoutId,
      ex.userId,
      ex.name,
      ex.catalogExerciseId,
      ex.targetSets,
      ex.targetReps,
      ex.position,
      ex.createdAt,
    ]
  );
}

export function upsert(ex: WorkoutExerciseRow): void {
  getDb().runSync(
    `INSERT OR REPLACE INTO user_workout_exercises
     (id, workout_id, user_id, name, catalog_exercise_id, target_sets, target_reps, position, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      ex.id,
      ex.workoutId,
      ex.userId,
      ex.name,
      ex.catalogExerciseId,
      ex.targetSets,
      ex.targetReps,
      ex.position,
      ex.createdAt,
    ]
  );
}
