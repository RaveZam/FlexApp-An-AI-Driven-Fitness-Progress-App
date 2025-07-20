import { SetStateAction } from "react";

import { Dispatch } from "react";
import {
  InitialWorkoutPlan,
  CustomWorkoutPlan,
  Workouts,
} from "./WorkoutTypes";

type WorkoutContextType = {
  handleStartPlan: (
    plan: string,
    setPlanName: (plan: string) => void,
    setSelectedPlan: (steps: any[]) => void,
    setInitialWorkoutPlan: (plan: any) => void
  ) => void;
  getCurrentIndexDay: (
    initialWorkoutPlan: InitialWorkoutPlan,
    currentStepIndex: number
  ) => string;
  // addWorkout: (workout_name: string, id: number, workout_image: string) => void;
  selectedWorkouts: Workouts[];
  repsPerSet: Workouts[];
  setRepsPerSet: Dispatch<SetStateAction<Workouts[]>>;

  selectedDay: string;
  setSelectedDay: Dispatch<SetStateAction<string>>;
  showSuccessPopup: boolean;
  // handleSuccessPopupClose: () => void;
  setWorkoutNumberOfDays: Dispatch<SetStateAction<number>>;
  setRestDays: Dispatch<SetStateAction<string[]>>;
  restDays: string[];
  workoutNumberOfDays: number;
  setInitialWorkoutPlan: Dispatch<SetStateAction<InitialWorkoutPlan | null>>;
  initialWorkoutPlan: InitialWorkoutPlan | null;
  setWorkoutDaysIndex: Dispatch<SetStateAction<number>>;
  workoutDays: any[];
  workoutDaysIndex: number;
  shouldSave: boolean;
  setShouldSave: Dispatch<SetStateAction<boolean>>;
  planName: string;
  setPlanName: Dispatch<SetStateAction<string>>;
  setShowSuccessPopup: Dispatch<SetStateAction<boolean>>;
  workoutDayNames: string[];
  setworkoutDayNames: Dispatch<SetStateAction<string[]>>;
  currentStepIndex: number;
  setSelectedWorkouts: Dispatch<SetStateAction<Workouts[]>>;
  selectedPlan: string;
  setSelectedPlan: Dispatch<SetStateAction<string[]>>;
  customWorkoutPlan: CustomWorkoutPlan[];
  setCurrentStepIndex: Dispatch<SetStateAction<number>>;
};

export type { WorkoutContextType };
