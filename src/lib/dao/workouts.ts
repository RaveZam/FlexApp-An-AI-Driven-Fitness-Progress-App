import { getDb } from "@/src/lib/db";

export type WorkoutRow = {
  id: string;
  userId: string;
  planId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

type Raw = {
  id: string;
  user_id: string;
  plan_id: string;
  name: string;
  created_at: string;
  updated_at: string;
};

const fromRaw = (r: Raw): WorkoutRow => ({
  id: r.id,
  userId: r.user_id,
  planId: r.plan_id,
  name: r.name,
  createdAt: r.created_at,
  updatedAt: r.updated_at,
});

export function listWorkoutsByUser(userId: string): WorkoutRow[] {
  return getDb()
    .getAllSync<Raw>(
      "SELECT * FROM user_workouts WHERE user_id = ? ORDER BY created_at DESC",
      [userId]
    )
    .map(fromRaw);
}

export function listWorkoutsByPlan(planId: string): WorkoutRow[] {
  return getDb()
    .getAllSync<Raw>(
      "SELECT * FROM user_workouts WHERE plan_id = ? ORDER BY created_at ASC",
      [planId]
    )
    .map(fromRaw);
}

export function getWorkoutUpdatedAt(workoutId: string): string | null {
  return (
    getDb().getFirstSync<{ updated_at: string }>(
      "SELECT updated_at FROM user_workouts WHERE id = ?",
      [workoutId]
    )?.updated_at ?? null
  );
}

export function insertWorkout(workout: WorkoutRow): void {
  getDb().runSync(
    `INSERT INTO user_workouts (id, user_id, plan_id, name, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [workout.id, workout.userId, workout.planId, workout.name, workout.createdAt, workout.updatedAt]
  );
}

export function upsertWorkout(workout: WorkoutRow): void {
  getDb().runSync(
    `INSERT INTO user_workouts (id, user_id, plan_id, name, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
       plan_id = excluded.plan_id,
       name = excluded.name,
       updated_at = excluded.updated_at
     WHERE excluded.updated_at >= user_workouts.updated_at`,
    [workout.id, workout.userId, workout.planId, workout.name, workout.createdAt, workout.updatedAt]
  );
}

export function touchWorkoutUpdatedAt(workoutId: string, updatedAt: string): void {
  getDb().runSync("UPDATE user_workouts SET updated_at = ? WHERE id = ?", [
    updatedAt,
    workoutId,
  ]);
}
