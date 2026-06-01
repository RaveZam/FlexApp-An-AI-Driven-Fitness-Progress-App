import { useAuth } from "@/src/features/auth/hooks/useAuth";
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
import { getActiveSession } from "../services/sessionLocalService";
import type { WorkoutSession } from "../types";

type ActivePlanContextValue = {
  activePlanId: string | null;
  setActivePlan: (planId: string | null) => void;
  activeSession: WorkoutSession | null;
  refreshActiveSession: () => void;
  loading: boolean;
};

const ActivePlanContext = createContext<ActivePlanContextValue | null>(null);

export function ActivePlanProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [activePlanId, setActivePlanId] = useState<string | null>(null);
  const [activeSession, setActiveSession] = useState<WorkoutSession | null>(null);
  const [loading, setLoading] = useState(true);

  //This exists here since if we put this on home id be technically having a DAO on home.
  const refreshActiveSession = useCallback(() => {
    if (!user) {
      setActiveSession(null);
      return;
    }
    setActiveSession(getActiveSession(user.id));
  }, [user]);

  useEffect(() => {
    if (!user) {
      setActivePlanId(null);
      setActiveSession(null);
      setLoading(false);
      return;
    }
    const prefs = getPreferences(user.id);
    setActivePlanId(prefs?.activePlanId ?? null);
    setActiveSession(getActiveSession(user.id));
    setLoading(false);
  }, [user]);

  const setActivePlan = useCallback(
    (planId: string | null) => {
      if (!user) return;
      setActivePlanLocal(user.id, planId);
      setActivePlanId(planId);
    },
    [user]
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
