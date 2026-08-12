import { useCallback, useEffect, useMemo, useState } from "react";
import { useFocusEffect } from "expo-router";
import { deleteSession } from "@/src/features/workouts";
import { getCurrentUserId } from "@/src/lib/current-user";
import { computeOverviewStats, groupByMonth } from "../sessionStats";
import { listCompletedSessions } from "../services/historyLocalService";
import type { WorkoutSessionSummary } from "../types";

export function useSessionHistory() {
  const userId = getCurrentUserId();
  const [sessions, setSessions] = useState<WorkoutSessionSummary[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    try {
      setSessions(listCompletedSessions(userId));
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => { load(); }, [load]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const deleteOne = useCallback((sessionId: string) => {
    deleteSession(sessionId);
    load();
  }, [load]);

  const stats = useMemo(() => computeOverviewStats(sessions), [sessions]);
  const sections = useMemo(() => groupByMonth(sessions), [sessions]);

  return { sessions, stats, sections, loading, refresh: load, deleteOne };
}
