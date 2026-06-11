import { getSessionById } from "@/src/features/workouts";
import * as sessionSummaryDao from "@/src/lib/dao/sessionSummary";
import type { WorkoutSession } from "@/src/features/workouts";
import type { WorkoutSessionSummary } from "../types";

export function listCompletedSessions(userId: string): WorkoutSessionSummary[] {
  return sessionSummaryDao.listCompletedSummariesByUser(userId).map((r) => ({
    id: r.id,
    name: r.name,
    startedAt: r.startedAt,
    completedAt: r.completedAt ?? r.startedAt,
    exerciseCount: r.exerciseCount,
    completedSetCount: r.completedSetCount,
    totalSetCount: r.totalSetCount,
    volume: r.volume,
  }));
}

export function getCompletedSessionDetail(sessionId: string): WorkoutSession | null {
  const session = getSessionById(sessionId);
  if (!session || session.status === "in_progress") return null;
  return session;
}
