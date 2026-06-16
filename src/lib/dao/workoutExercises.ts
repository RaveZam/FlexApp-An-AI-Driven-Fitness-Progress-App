import { getDb } from "@/src/lib/db";

export type WorkoutExerciseRow = {
  id: string;
  workoutId: string;
  userId: string;
  name: string;
  catalogExerciseId: string | null;
  muscleGroup?: string | null;
  targetSets: number;
  targetReps: number;
  position: number;
  isUnilateral: boolean;
  createdAt: string;
};

type Raw = {
  id: string;
  workout_id: string;
  user_id: string;
  name: string;
  catalog_exercise_id: string | null;
  muscle_group: string | null;
  target_sets: number;
  target_reps: number;
  position: number;
  is_unilateral: number;
  created_at: string;
};

const fromRaw = (r: Raw): WorkoutExerciseRow => ({
  id: r.id,
  workoutId: r.workout_id,
  userId: r.user_id,
  name: r.name,
  catalogExerciseId: r.catalog_exercise_id,
  muscleGroup: r.muscle_group,
  targetSets: r.target_sets,
  targetReps: r.target_reps,
  position: r.position,
  isUnilateral: r.is_unilateral === 1,
  createdAt: r.created_at,
});

export function listWorkoutExercisesByWorkout(workoutId: string): WorkoutExerciseRow[] {
  return getDb()
    .getAllSync<Raw>(
      `SELECT e.*, c.muscle_group AS muscle_group
       FROM user_workout_exercises e
       LEFT JOIN exercises_catalog c ON c.id = e.catalog_exercise_id
       WHERE e.workout_id = ? ORDER BY e.position ASC`,
      [workoutId]
    )
    .map(fromRaw);
}

export function insertWorkoutExercise(ex: WorkoutExerciseRow): void {
  getDb().runSync(
    `INSERT INTO user_workout_exercises
     (id, workout_id, user_id, name, catalog_exercise_id, target_sets, target_reps, position, is_unilateral, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      ex.id,
      ex.workoutId,
      ex.userId,
      ex.name,
      ex.catalogExerciseId,
      ex.targetSets,
      ex.targetReps,
      ex.position,
      ex.isUnilateral ? 1 : 0,
      ex.createdAt,
    ]
  );
}

export function upsertWorkoutExercise(ex: WorkoutExerciseRow): void {
  getDb().runSync(
    `INSERT OR REPLACE INTO user_workout_exercises
     (id, workout_id, user_id, name, catalog_exercise_id, target_sets, target_reps, position, is_unilateral, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      ex.id,
      ex.workoutId,
      ex.userId,
      ex.name,
      ex.catalogExerciseId,
      ex.targetSets,
      ex.targetReps,
      ex.position,
      ex.isUnilateral ? 1 : 0,
      ex.createdAt,
    ]
  );
}

export function updateWorkoutExerciseTargets(id: string, targetSets: number, targetReps: number): void {
  getDb().runSync(
    "UPDATE user_workout_exercises SET target_sets = ?, target_reps = ? WHERE id = ?",
    [targetSets, targetReps, id]
  );
}

export function deleteWorkoutExerciseById(id: string): void {
  getDb().runSync("DELETE FROM user_workout_exercises WHERE id = ?", [id]);
}

export function deleteWorkoutExercisesByWorkout(workoutId: string): void {
  getDb().runSync("DELETE FROM user_workout_exercises WHERE workout_id = ?", [workoutId]);
}
