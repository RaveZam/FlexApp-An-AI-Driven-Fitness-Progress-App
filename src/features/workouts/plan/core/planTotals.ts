import type { WorkoutPlan } from "../../types";

export type PlanTotals = { dayCount: number; exerciseCount: number };

export function getPlanTotals(plan: WorkoutPlan): PlanTotals {
  return {
    dayCount: plan.workouts.length,
    exerciseCount: plan.workouts.reduce(
      (sum, workout) => sum + workout.exercises.length,
      0
    ),
  };
}
