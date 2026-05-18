import { useAuth } from "@/src/features/auth/hooks/useAuth";
import { useCallback, useEffect, useState } from "react";
import { getPreferences, setActivePlan as setActivePlanLocal } from "../services/preferencesLocalService";

export function useActivePlan() {
  const { user } = useAuth();
  const [activePlanId, setActivePlanId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
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

  return { activePlanId, setActivePlan, loading };
}
