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

type ActivePlanContextValue = {
  activePlanId: string | null;
  setActivePlan: (planId: string | null) => void;
  loading: boolean;
};

const ActivePlanContext = createContext<ActivePlanContextValue | null>(null);

export function ActivePlanProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [activePlanId, setActivePlanId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setActivePlanId(null);
      setLoading(false);
      return;
    }
    const prefs = getPreferences(user.id);
    setActivePlanId(prefs?.activePlanId ?? null);
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
    <ActivePlanContext.Provider value={{ activePlanId, setActivePlan, loading }}>
      {children}
    </ActivePlanContext.Provider>
  );
}

export function useActivePlan() {
  const ctx = useContext(ActivePlanContext);
  if (!ctx) throw new Error("useActivePlan must be used within ActivePlanProvider");
  return ctx;
}
