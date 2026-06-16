import { useAuth } from "@/src/features/auth";
import { useMemo, useState } from "react";
import { getRestTimerSeconds } from "../../services/preferencesLocalService";
import { DEFAULT_REST_TIMER_SECONDS } from "../../types";

export function useRestTimer() {
  const { user } = useAuth();

  // Visibility lives in the screen's hook instance and is passed to
  // RestTimerModal as a prop — the modal's own useRestTimer() call is a
  // separate instance and only uses the preference time.
  const [showRestTimer, setShowRestTimer] = useState(false);

  const getUserPreferenceRestTime = useMemo(( ) => {
    if (!user) return DEFAULT_REST_TIMER_SECONDS;
    return getRestTimerSeconds(user.id);
  }, [user]);

  return {
    getUserPreferenceRestTime,
    showRestTimer,
    openRestTimer: () => setShowRestTimer(true),
    closeRestTimer: () => setShowRestTimer(false),
  };
}
