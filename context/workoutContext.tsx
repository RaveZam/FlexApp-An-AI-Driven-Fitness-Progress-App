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
  } = useWorkoutPlanCreator();
  const [selectedDay, setSelectedDay] = React.useState<string>("Mon");

  return (
    <WorkoutContext.Provider
      value={{
        handleStartPlan,
        getCurrentIndexDay,
        addWorkout,
        selectedWorkouts,
        repsPerSet,
        setRepsPerSet,
        handleNextDay,
        selectedDay,
        setSelectedDay,
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
}
