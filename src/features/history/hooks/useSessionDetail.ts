import { useEffect, useState } from "react";
import { getCompletedSessionDetail } from "../services/historyLocalService";
import type { WorkoutSession } from "@/src/features/workouts/types";

export function useSessionDetail(sessionId: string) {
  const [session, setSession] = useState<WorkoutSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    try {
      const result = getCompletedSessionDetail(sessionId);
      setSession(result);
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  return { session, loading };
}
