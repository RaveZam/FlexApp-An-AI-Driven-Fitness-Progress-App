import { useAuth } from "@/src/features/auth/hooks/useAuth";
import {
  getActiveSession,
  getSessionById,
} from "@/src/features/workouts/services/sessionLocalService";
import { router } from "expo-router";
import { useEffect } from "react";

export function useSessionGuard(sessionId: string | undefined): void {
  const { user } = useAuth();

  useEffect(() => {
    if (!sessionId || !user) return;
    const session = getSessionById(sessionId);
    if (!session || session.status !== "in_progress") {
      const ongoing = getActiveSession(user.id);
      if (ongoing && ongoing.id !== sessionId) {
        router.replace(`/(tabs)/Workouts/session?id=${ongoing.id}` as any);
      } else {
        router.back();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
