import { useAuth } from "@/src/features/auth/hooks/useAuth";
import { getDb } from "@/src/lib/db";
import { useMemo } from "react";

export type ExerciseBestRecord = {
  weight: number;
  reps: number;
  date: string;
};

export type ExerciseSessionPoint = {
  sessionId: string;
  startedAt: string;
  maxWeight: number;
  repsAtMax: number;
};

export type ExerciseHistory = {
  best: ExerciseBestRecord | null;
  recentSessions: ExerciseSessionPoint[];
};

function queryBestRecord(userId: string, exerciseName: string): ExerciseBestRecord | null {
  const db = getDb();
  const row = db.getFirstSync<{
    weight: number;
    actual_reps: number | null;
    completed_at: string | null;
    started_at: string;
  }>(
    `SELECT ss.weight, ss.actual_reps, ss.completed_at, ws.started_at
     FROM session_sets ss
     JOIN session_exercises se ON ss.session_exercise_id = se.id
     JOIN workout_sessions ws ON se.session_id = ws.id
     WHERE ws.user_id = ?
       AND se.name = ?
       AND ss.completed = 1
       AND ss.weight IS NOT NULL
       AND ws.status != 'cancelled'
     ORDER BY ss.weight DESC, ss.actual_reps DESC
     LIMIT 1`,
    [userId, exerciseName]
  );
  if (!row) return null;
  return {
    weight: row.weight,
    reps: row.actual_reps ?? 0,
    date: row.completed_at ?? row.started_at,
  };
}

function queryRecentSessions(userId: string, exerciseName: string): ExerciseSessionPoint[] {
  const db = getDb();
  const rows = db.getAllSync<{
    id: string;
    started_at: string;
    weight: number;
    actual_reps: number | null;
  }>(
    `SELECT ws.id AS id, ws.started_at AS started_at, ss.weight AS weight, ss.actual_reps AS actual_reps
     FROM workout_sessions ws
     JOIN session_exercises se ON se.session_id = ws.id
     JOIN session_sets ss ON ss.session_exercise_id = se.id
     WHERE ws.user_id = ?
       AND se.name = ?
       AND ss.completed = 1
       AND ss.weight IS NOT NULL
       AND ws.status != 'cancelled'
     ORDER BY ss.weight DESC, ss.actual_reps DESC`,
    [userId, exerciseName]
  );

  const topPerSession = new Map<string, { startedAt: string; weight: number; reps: number }>();
  for (const r of rows) {
    if (!topPerSession.has(r.id)) {
      topPerSession.set(r.id, {
        startedAt: r.started_at,
        weight: r.weight,
        reps: r.actual_reps ?? 0,
      });
    }
  }

  return Array.from(topPerSession.entries())
    .map(([sessionId, v]) => ({
      sessionId,
      startedAt: v.startedAt,
      maxWeight: v.weight,
      repsAtMax: v.reps,
    }))
    .sort((a, b) => (a.startedAt < b.startedAt ? 1 : -1))
    .slice(0, 7)
    .reverse();
}

export function useExerciseHistory(exerciseName: string | undefined, refreshKey?: unknown): ExerciseHistory {
  const { user } = useAuth();
  const userId = user?.id;

  return useMemo(() => {
    if (!userId || !exerciseName) return { best: null, recentSessions: [] };
    return {
      best: queryBestRecord(userId, exerciseName),
      recentSessions: queryRecentSessions(userId, exerciseName),
    };
  }, [userId, exerciseName, refreshKey]);
}
