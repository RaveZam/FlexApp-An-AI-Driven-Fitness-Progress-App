import { getCurrentUserId } from "@/src/lib/current-user";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { fetchPlans } from "../../services/workoutSupabaseService";
import { listPlans, upsertPlans } from "../../services/workoutLocalService";
import type { WorkoutPlan } from "../../types";

export function usePlans() {
  const userId = getCurrentUserId();

  const [plans, setPlans] = useState<WorkoutPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!userId) {
      setPlans([]);
      setLoading(false);
      return;
    }

    const local = listPlans(userId);
    setPlans(local);
    setLoading(false);

    try {
      const remote = await fetchPlans(userId);
      upsertPlans(remote);
      setPlans(listPlans(userId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sync failed");
    }
  }, [userId]);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      load();
    }, [load])
  );

  return { plans, loading, error, refresh: load };
}
