import { useAuth } from "@/src/features/auth";
import { useCallback } from "react";
import { createSessionFromWorkout } from "../services/sessionLocalService";
import type { Workout } from "../../types";

export function useStartSession() {
  const { user } = useAuth();

  const startSession = useCallback(
    (workout: Workout): string => {
      if (!user) throw new Error("Not authenticated");
      const session = createSessionFromWorkout(user.id, workout);
      return session.id;
    },
    [user]
  );

  return { startSession };
}
