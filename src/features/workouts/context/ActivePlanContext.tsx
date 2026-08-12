import { getCurrentUserId } from "@/src/lib/current-user";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  getPreferences,
  setActivePlan as setActivePlanLocal,
} from "../services/preferencesLocalService";
import type { WorkoutSession } from "../types";

// TODO(session-rebuild): sessionLocalService was removed for the session
// reconstruction; restore the real lookup once the new service exists.
function getActiveSession(_userId: string): WorkoutSession | null {
  return null;
}

type ActivePlanContextValue = {
  activePlanId: string | null;
  setActivePlan: (planId: string | null) => void;
  activeSession: WorkoutSession | null;
  refreshActiveSession: () => void;
  loading: boolean;
};

const ActivePlanContext = createContext<ActivePlanContextValue | null>(null);

export function ActivePlanProvider({ children }: { children: ReactNode }) {
  const userId = getCurrentUserId();
  const [activePlanId, setActivePlanId] = useState<string | null>(null);
  const [activeSession, setActiveSession] = useState<WorkoutSession | null>(null);
  const [loading, setLoading] = useState(true);

  //This exists here since if we put this on home id be technically having a DAO on home.
  const refreshActiveSession = useCallback(() => {
    if (!userId) {
      setActiveSession(null);
      return;
    }
    setActiveSession(getActiveSession(userId));
  }, [userId]);

  useEffect(() => {
    if (!userId) {
      setActivePlanId(null);
      setActiveSession(null);
      setLoading(false);
      return;
    }
    const prefs = getPreferences(userId);
    setActivePlanId(prefs?.activePlanId ?? null);
    setActiveSession(getActiveSession(userId));
    setLoading(false);
  }, [userId]);

  const setActivePlan = useCallback(
    (planId: string | null) => {
      if (!userId) return;
      setActivePlanLocal(userId, planId);
      setActivePlanId(planId);
    },
    [userId]
  );

  return (
    <ActivePlanContext.Provider
      value={{
        activePlanId,
        setActivePlan,
        activeSession,
        refreshActiveSession,
        loading,
      }}
    >
      {children}
    </ActivePlanContext.Provider>
  );
}

export function useActivePlan() {
  const ctx = useContext(ActivePlanContext);
  if (!ctx) throw new Error("useActivePlan must be used within ActivePlanProvider");
  return ctx;
}

export function useActiveSession() {
  const { activeSession, refreshActiveSession, loading } = useActivePlan();
  return { activeSession, refresh: refreshActiveSession, loading };
}
