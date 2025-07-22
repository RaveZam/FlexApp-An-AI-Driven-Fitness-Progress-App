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

export const getCurrentIndexDay = (
  initialWorkoutPlan: InitialWorkoutPlan,
  currentStepIndex: number
) => {
  return initialWorkoutPlan?.workoutPlan?.[currentStepIndex]?.key;
};
