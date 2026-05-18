import { useAuth } from "@/src/features/auth/hooks/useAuth";
import { useCallback } from "react";
import { createSessionFromWorkout, getActiveSession } from "../services/sessionLocalService";
import type { Workout } from "../types";

export function useStartSession() {
  const { user } = useAuth();

  const startSession = useCallback(
    (workout: Workout): string => {
      if (!user) throw new Error("Not authenticated");
      const existing = getActiveSession(user.id);
      if (existing) return existing.id;
      const session = createSessionFromWorkout(user.id, workout);
      return session.id;
    },
    [user]
  );

  return { startSession };
}
