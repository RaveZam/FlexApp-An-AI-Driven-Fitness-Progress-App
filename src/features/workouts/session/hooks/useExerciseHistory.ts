import { useAuth } from "@/src/features/auth";
import * as exerciseStatsDao from "@/src/lib/dao/exerciseStats";
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

function buildBest(userId: string, exerciseName: string): ExerciseBestRecord | null {
  const row = exerciseStatsDao.getBestRecord(userId, exerciseName);
  if (!row) return null;
  return {
    weight: row.weight,
    reps: row.actualReps ?? 0,
    date: row.completedAt ?? row.startedAt,
  };
}

function buildRecentSessions(userId: string, exerciseName: string): ExerciseSessionPoint[] {
  const rows = exerciseStatsDao.listTopSetsByExercise(userId, exerciseName);
  const topPerSession = new Map<string, { startedAt: string; weight: number; reps: number }>();
  for (const r of rows) {
    if (!topPerSession.has(r.sessionId)) {
      topPerSession.set(r.sessionId, {
        startedAt: r.startedAt,
        weight: r.weight,
        reps: r.actualReps ?? 0,
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

export function useExerciseHistory(
  exerciseName: string | undefined,
  refreshKey?: unknown
): ExerciseHistory {
  const { user } = useAuth();
  const userId = user?.id;

  return useMemo(() => {
    if (!userId || !exerciseName) return { best: null, recentSessions: [] };
    return {
      best: buildBest(userId, exerciseName),
      recentSessions: buildRecentSessions(userId, exerciseName),
    };
  }, [userId, exerciseName, refreshKey]);
}
