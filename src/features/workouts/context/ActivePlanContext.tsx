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

type ActivePlanContextValue = {
  activePlanId: string | null;
  setActivePlan: (planId: string | null) => void;
  loading: boolean;
};

const ActivePlanContext = createContext<ActivePlanContextValue | null>(null);

export function ActivePlanProvider({ children }: { children: ReactNode }) {
  const userId = getCurrentUserId();
  const [activePlanId, setActivePlanId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setActivePlanId(null);
      setLoading(false);
      return;
    }
    const prefs = getPreferences(userId);
    setActivePlanId(prefs?.activePlanId ?? null);
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
