import { getDb } from "@/src/lib/db";
import { hydrateSession } from "@/src/features/workouts/services/sessionLocalService";
import type { WorkoutSession } from "@/src/features/workouts/types";
import type { WorkoutSessionSummary } from "../types";

export function listCompletedSessions(userId: string): WorkoutSessionSummary[] {
  const db = getDb();
  const rows = db.getAllSync<{
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
  );

  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    startedAt: r.started_at,
    completedAt: r.completed_at ?? r.started_at,
    exerciseCount: r.exercise_count,
    completedSetCount: r.completed_set_count,
    totalSetCount: r.total_set_count,
  }));
}

export function getCompletedSessionDetail(sessionId: string): WorkoutSession | null {
  const db = getDb();
  const row = db.getFirstSync<{
    id: string; user_id: string; workout_id: string; plan_id: string | null;
    name: string; status: string; started_at: string; completed_at: string | null;
    created_at: string; updated_at: string;
  }>(
    "SELECT * FROM workout_sessions WHERE id = ? AND status != 'in_progress'",
    [sessionId]
  );
  if (!row) return null;
  return hydrateSession(row);
}
