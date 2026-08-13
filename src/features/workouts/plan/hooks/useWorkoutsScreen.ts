import { useRouter } from "expo-router";
import { useCallback } from "react";
import { usePlans } from "./usePlans";

export function useWorkoutsScreen() {
  const router = useRouter();
  const { plans, loading } = usePlans();

  const openPlan = useCallback(
    (planId: string) =>
      router.push({ pathname: "/(tabs)/Workouts/plan", params: { planId } }),
    [router]
  );

  return { plans, loading, openPlan };
}
