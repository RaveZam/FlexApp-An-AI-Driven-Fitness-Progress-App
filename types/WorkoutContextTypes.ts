import { SetStateAction } from "react";

import { Dispatch } from "react";
import {
  CustomWorkoutPlan,
  InitialWorkoutPlan,
  Workouts,
} from "./WorkoutTypes";

type WorkoutContextType = {
  getCurrentIndexDay: (
    initialWorkoutPlan: InitialWorkoutPlan,
    currentStepIndex: number
  ) => string;
  selectedWorkouts: Workouts[];
  repsPerSet: Workouts[];
  setRepsPerSet: Dispatch<SetStateAction<Workouts[]>>;

  selectedDay: string;
  setSelectedDay: Dispatch<SetStateAction<string>>;
  showSuccessPopup: boolean;
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
  dayInput: string;
  setdayInput: Dispatch<SetStateAction<string>>;
  dayOfTheWeek: string[];
  setDayOfTheWeek: Dispatch<SetStateAction<string[]>>;
  currentDayWorkout: Workouts[];
  setCurrentDayWorkout: Dispatch<SetStateAction<Workouts[]>>;
  currentWorkout: any;
  setCurrentWorkout: Dispatch<SetStateAction<any>>;
  activeWorkoutID: number | null;
  setActiveWorkoutID: Dispatch<SetStateAction<number | null>>;
};

export type { WorkoutContextType };
