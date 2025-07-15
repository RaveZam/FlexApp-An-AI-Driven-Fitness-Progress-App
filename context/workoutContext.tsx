import { useWorkoutPlanCreator } from "@/hooks/useWorkoutPlanCreator";
import React, { createContext, Dispatch, SetStateAction } from "react";

type WorkoutContextType = {
  handleStartPlan: (plan: string) => void;
  getCurrentIndexDay: () => string;
  addWorkout: (workout_name: string, id: number, workout_image: string) => void;
  selectedWorkouts: any[];
  repsPerSet: any[];
  setRepsPerSet: Dispatch<SetStateAction<any[]>>;
  handleNextDay: () => void;
  selectedDay: string;
  setSelectedDay: Dispatch<SetStateAction<string>>;
  saveToSupaBase: () => Promise<void>;
  showSuccessPopup: boolean;
  handleSuccessPopupClose: () => void;
  setWorkoutNumberOfDays: Dispatch<SetStateAction<number>>;
  setRestDays: Dispatch<SetStateAction<string[]>>;
  restDays: any[];
  workoutNumberOfDays: number;
  setInitialWorkoutPlan: Dispatch<SetStateAction<any[]>>;
  initialWorkoutPlan: any[];
};

export const WorkoutContext = createContext<WorkoutContextType | undefined>(
  undefined
);

export default function workoutContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    handleStartPlan,
    getCurrentIndexDay,
    addWorkout,
    selectedWorkouts,
    repsPerSet,
    setRepsPerSet,
    handleNextDay,
    saveToSupaBase,
    showSuccessPopup,
    handleSuccessPopupClose,
    setWorkoutNumberOfDays,
    setRestDays,
    restDays,
    workoutNumberOfDays,
    setInitialWorkoutPlan,
    initialWorkoutPlan,
  } = useWorkoutPlanCreator();
  const [selectedDay, setSelectedDay] = React.useState<string>("Mon");

  return (
    <WorkoutContext.Provider
      value={{
        workoutNumberOfDays,
        restDays,
        setRestDays,
        handleStartPlan,
        getCurrentIndexDay,
        addWorkout,
        selectedWorkouts,
        repsPerSet,
        setRepsPerSet,
        handleNextDay,
        selectedDay,
        setSelectedDay,
        saveToSupaBase,
        showSuccessPopup,
        handleSuccessPopupClose,
        setWorkoutNumberOfDays,
        setInitialWorkoutPlan,
        initialWorkoutPlan,
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
}
