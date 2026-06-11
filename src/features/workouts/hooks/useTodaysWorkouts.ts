import { useMemo } from "react";
import { usePlans } from "./usePlans";
import { useActivePlan } from "../context/ActivePlanContext";
import type { Workout } from "../types";

export function useTodaysWorkouts(): { workouts: Workout[]; loading: boolean } {
  const { activePlanId, loading: prefLoading } = useActivePlan();
  const { plans, loading: plansLoading } = usePlans();

  const workouts = useMemo(() => {
    if (!activePlanId) return [];
    const plan = plans.find((p) => p.id === activePlanId);
    if (!plan) return [];
    const today = new Date().getDay(); // 0=Sun … 6=Sat
    return plan.workouts.filter((w) => w.daysOfWeek.includes(today));
  }, [activePlanId, plans]);

  return { workouts, loading: prefLoading || plansLoading };
}
