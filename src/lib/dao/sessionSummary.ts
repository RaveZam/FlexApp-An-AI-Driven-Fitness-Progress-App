import { getDb } from "@/src/lib/db";

export type CompletedSessionSummaryRow = {
  id: string;
  name: string;
  startedAt: string;
  completedAt: string | null;
  exerciseCount: number;
  completedSetCount: number;
  totalSetCount: number;
};

export function listCompletedSummariesByUser(userId: string): CompletedSessionSummaryRow[] {
  return getDb()
    .getAllSync<{
      id: string;
      name: string;
      started_at: string;
      completed_at: string | null;
      exercise_count: number;
      completed_set_count: number;
      total_set_count: number;
    }>(
      `SELECT
         ws.id,
         ws.name,
         ws.started_at,
         ws.completed_at,
         (SELECT COUNT(*) FROM session_exercises se WHERE se.session_id = ws.id) AS exercise_count,
         (SELECT COUNT(*) FROM session_sets ss
            JOIN session_exercises se ON ss.session_exercise_id = se.id
            WHERE se.session_id = ws.id AND ss.completed = 1) AS completed_set_count,
         (SELECT COUNT(*) FROM session_sets ss
            JOIN session_exercises se ON ss.session_exercise_id = se.id
            WHERE se.session_id = ws.id) AS total_set_count
       FROM workout_sessions ws
       WHERE ws.user_id = ? AND ws.status != 'in_progress'
       ORDER BY COALESCE(ws.completed_at, ws.started_at) DESC`,
      [userId]
    )
    .map((r) => ({
      id: r.id,
      name: r.name,
      startedAt: r.started_at,
      completedAt: r.completed_at,
      exerciseCount: r.exercise_count,
      completedSetCount: r.completed_set_count,
      totalSetCount: r.total_set_count,
    }));
}
