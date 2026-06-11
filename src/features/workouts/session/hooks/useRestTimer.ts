import { useAuth } from "@/src/features/auth";
import { useCallback } from "react";
import { getRestTimerSeconds } from "../../services/preferencesLocalService";
import { DEFAULT_REST_TIMER_SECONDS } from "../../types";

export function useRestTimer() {
  const { user } = useAuth();

  const getUserPreferenceRestTime = useCallback(() => {
    if (!user) return DEFAULT_REST_TIMER_SECONDS;
    return getRestTimerSeconds(user.id);
  }, [user]);

  return { getUserPreferenceRestTime };
}
