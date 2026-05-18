import { useAuth } from "@/src/features/auth/hooks/useAuth";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { getActiveSession } from "../services/sessionLocalService";
import type { WorkoutSession } from "../types";

export function useActiveSession() {
  const { user } = useAuth();
  const [activeSession, setActiveSession] = useState<WorkoutSession | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    if (!user) return;
    const session = getActiveSession(user.id);
    setActiveSession(session);
    setLoading(false);
  }, [user]);

  useFocusEffect(refresh);

  return { activeSession, loading, refresh };
}
