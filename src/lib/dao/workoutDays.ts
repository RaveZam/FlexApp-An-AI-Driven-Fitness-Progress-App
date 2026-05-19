import { getDb } from "@/src/lib/db";

export function listByWorkoutIds(workoutIds: string[]): Map<string, number[]> {
  const map = new Map<string, number[]>();
  if (workoutIds.length === 0) return map;
  const placeholders = workoutIds.map(() => "?").join(",");
  const rows = getDb().getAllSync<{ workout_id: string; day_of_week: number }>(
    `SELECT workout_id, day_of_week FROM user_workout_days
     WHERE workout_id IN (${placeholders}) ORDER BY day_of_week ASC`,
    workoutIds
  );
  for (const r of rows) {
    const existing = map.get(r.workout_id);
    if (existing) existing.push(r.day_of_week);
    else map.set(r.workout_id, [r.day_of_week]);
  }
  return map;
}

export function replace(workoutId: string, daysOfWeek: number[], now: string): void {
  const db = getDb();
  db.runSync("DELETE FROM user_workout_days WHERE workout_id = ?", [workoutId]);
  for (const d of daysOfWeek) {
    db.runSync(
      "INSERT OR IGNORE INTO user_workout_days (workout_id, day_of_week, created_at) VALUES (?, ?, ?)",
      [workoutId, d, now]
    );
  }
}
