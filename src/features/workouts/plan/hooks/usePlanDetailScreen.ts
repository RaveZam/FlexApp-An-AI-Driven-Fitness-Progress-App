import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback } from "react";
import { useActivePlan } from "../../context/ActivePlanContext";
import { useEditPlan } from "./useEditPlan";
import { usePlans } from "./usePlans";

export function usePlanDetailScreen() {
  const router = useRouter();
  const { planId } = useLocalSearchParams<{ planId: string }>();
  const { plans, refresh } = usePlans();
  const { activePlanId, setActivePlan } = useActivePlan();
  const { renamePlan, deletePlan } = useEditPlan(planId);

  const plan = plans.find((plan) => plan.id === planId);
  const isActive = activePlanId === planId;

  const toggleActive = useCallback(
    () => setActivePlan(isActive ? null : (planId ?? null)),
    [isActive, planId, setActivePlan]
  );

  const openWorkout = useCallback(
    (workoutId: string) => router.push(`/(tabs)/Workouts/${workoutId}`),
    [router]
  );

  const renamePlanAndRefresh = useCallback(
    (name: string) => {
      renamePlan(name);
      refresh();
    },
    [renamePlan, refresh]
  );

  const deletePlanAndGoBack = useCallback(() => {
    deletePlan();
    router.back();
  }, [deletePlan, router]);

  return {
    planId,
    plan,
    isActive,
    toggleActive,
    openWorkout,
    renamePlan: renamePlanAndRefresh,
    deletePlan: deletePlanAndGoBack,
  };
}
