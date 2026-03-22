import { WorkoutContext } from "@/src/features/workouts/context/workoutContext";
import { useContext } from "react";

export const useWorkoutContext = () => {
  const context = useContext(WorkoutContext);
  if (!context) {
    throw new Error(
      "useWorkoutContext must be used inside WorkoutContextProvider"
    );
  }
  return context;
};
