import { WORKOUT_STEPS_BY_PLAN } from "@/constants/WorkoutConstants";
import { InitialWorkoutPlan } from "@/types/WorkoutTypes";
import { router } from "expo-router";

export const getStepsFromPlan = (selectedPlan: string) => {
  return (
    WORKOUT_STEPS_BY_PLAN[selectedPlan as keyof typeof WORKOUT_STEPS_BY_PLAN] ||
    []
  );
};

export const getInitialWorkoutPlan = (steps: any[]) => {
  return {
    workoutPlan: steps.map((step) => ({
      key: step.day,
      workouts: [],
    })),
  };
};

export const handleStartPlan = (
  plan: string,
  setPlanName: (plan: string) => void,
  setSelectedPlan: (steps: any[]) => void,
  setInitialWorkoutPlan: (plan: any) => void
) => {
  setPlanName(plan);
  const steps = getStepsFromPlan(plan);
  setSelectedPlan(steps);
  setInitialWorkoutPlan(getInitialWorkoutPlan(steps));
  router.push("/Workouts/WorkoutSelector");
};

export const getCurrentIndexDay = (
  initialWorkoutPlan: InitialWorkoutPlan,
  currentStepIndex: number
) => {
  console.log("Initial Workout Plan", initialWorkoutPlan);
  console.log("Current Step Index", currentStepIndex);
  return initialWorkoutPlan?.workoutPlan?.[currentStepIndex]?.key;
};
