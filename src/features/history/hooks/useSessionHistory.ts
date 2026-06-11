import { useCallback, useEffect, useMemo, useState } from "react";
import { useFocusEffect } from "expo-router";
import { useAuth } from "@/src/features/auth";
import { deleteSession } from "@/src/features/workouts";
import { computeOverviewStats, groupByMonth } from "../sessionStats";
import { listCompletedSessions } from "../services/historyLocalService";
import type { WorkoutSessionSummary } from "../types";

export function useSessionHistory() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<WorkoutSessionSummary[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    if (!user) {
      setSessions([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const result = listCompletedSessions(user.id);
      setSessions(result);
    } finally {
      setLoading(false);
    }
  }, [user]);

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
