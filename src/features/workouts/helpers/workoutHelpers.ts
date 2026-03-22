import { WORKOUT_STEPS_BY_PLAN } from "@/src/features/workouts/constants/WorkoutConstants";
import { InitialWorkoutPlan } from "@/src/features/workouts/types/WorkoutTypes";

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
      dayOfTheWeek: step.dayOfTheWeek,
    })),
  };
};

export const getCurrentIndexDay = (
  initialWorkoutPlan: InitialWorkoutPlan,
  currentStepIndex: number
) => {
  return initialWorkoutPlan?.workoutPlan?.[currentStepIndex]?.key;
};
