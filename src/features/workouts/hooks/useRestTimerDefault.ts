import { useAuth } from "@/src/features/auth/hooks/useAuth";
import { useCallback, useEffect, useState } from "react";
import {
  getRestTimerSeconds,
  setRestTimerSeconds as persist,
} from "../services/preferencesLocalService";
import {
  DEFAULT_REST_TIMER_SECONDS,
  MAX_REST_TIMER_SECONDS,
  MIN_REST_TIMER_SECONDS,
} from "../types";

export function useRestTimerDefault() {
  const { user } = useAuth();
  const [restSeconds, setRestSecondsState] = useState<number>(
    DEFAULT_REST_TIMER_SECONDS
  );

  useEffect(() => {
    if (!user) return;
    setRestSecondsState(getRestTimerSeconds(user.id));
  }, [user]);

  const setRestSeconds = useCallback(
    (seconds: number) => {
      if (!user) return;
      const clamped = Math.min(
        MAX_REST_TIMER_SECONDS,
        Math.max(MIN_REST_TIMER_SECONDS, Math.round(seconds))
      );
      persist(user.id, clamped);
      setRestSecondsState(clamped);
    },
    [user]
  );

  return { restSeconds, setRestSeconds };
}
