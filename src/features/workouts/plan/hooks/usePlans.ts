import { getCurrentUserId } from "@/src/lib/current-user";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { listPlans } from "../../services/workoutLocalService";
import type { WorkoutPlan } from "../../types";

export function usePlans() {
  const userId = getCurrentUserId();

  const [plans, setPlans] = useState<WorkoutPlan[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setPlans(userId ? listPlans(userId) : []);
    setLoading(false);
  }, [userId]);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      load();
    }, [load])
  );

  return { plans, loading, refresh: load };
}
