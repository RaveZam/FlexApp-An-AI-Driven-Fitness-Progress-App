import { getDb } from "@/src/lib/db";

export function getTipDB(
  userId: string,
  exerciseName: string,
  weight: number,
  reps: number,
): string | null {
  const db = getDb();
  const row = db.getFirstSync<{ tip: string }>(
    `SELECT tip FROM plateau_tips WHERE user_id = ? AND exercise_name = ? AND weight = ? AND reps = ?`,
    [userId, exerciseName, weight, reps],
  );
  return row?.tip ?? null;
}

export function saveTipDB(
  userId: string,
  exerciseName: string,
  weight: number,
  reps: number,
  tip: string,
): void {
  const db = getDb();
  db.runSync(
    `INSERT OR REPLACE INTO plateau_tips (user_id, exercise_name, weight, reps, tip, created_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [userId, exerciseName, weight, reps, tip, new Date().toISOString()],
  );
}
