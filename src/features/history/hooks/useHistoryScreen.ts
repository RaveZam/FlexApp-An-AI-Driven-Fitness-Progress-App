import { router } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { peakVolume, weeklyLoad } from "../sessionStats";
import type { WorkoutSessionSummary } from "../types";
import { useSessionHistory } from "./useSessionHistory";

const SKYLINE_WEEKS = 26;

export function useHistoryScreen() {
  const { sessions, stats, sections, loading, deleteOne } = useSessionHistory();
  const [menuSession, setMenuSession] = useState<WorkoutSessionSummary | null>(null);

  const weeks = useMemo(() => weeklyLoad(sessions, SKYLINE_WEEKS), [sessions]);
  const peakWeek = useMemo(
    () => weeks.reduce((max, w) => (w.volume > max ? w.volume : max), 0),
    [weeks],
  );
  const peakSession = useMemo(() => peakVolume(sessions), [sessions]);

  const openSession = useCallback((sessionId: string) => {
    router.push(`/(tabs)/History/${sessionId}` as never);
  }, []);

  const closeMenu = useCallback(() => setMenuSession(null), []);

  return {
    loading,
    isEmpty: sessions.length === 0,
    sections,
    stats,
    weeks,
    peakWeek,
    peakSession,
    menuSession,
    openMenu: setMenuSession,
    closeMenu,
    deleteSession: deleteOne,
    openSession,
  };
}
