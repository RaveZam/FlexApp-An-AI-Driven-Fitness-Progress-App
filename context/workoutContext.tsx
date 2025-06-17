import { useWorkoutPlanCreator } from "@/hooks/useWorkoutPlanCreator";
import { createContext } from "react";

type WorkoutContextType = {
  selectedPlan: string;
  setSelectedPlan: React.Dispatch<React.SetStateAction<string>>;
  selectedDay: string;
  setSelectedDay: React.Dispatch<React.SetStateAction<string>>;
  selectedWorkouts: any[];
  addWorkout: (workout_name: string, id: number, workout_image: string) => void;
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
    selectedPlan,
    setSelectedPlan,
    selectedDay,
    setSelectedDay,
    selectedWorkouts,
    addWorkout,
  } = useWorkoutPlanCreator();

  return (
    <WorkoutContext.Provider
      value={{
        selectedDay,
        setSelectedDay,
        selectedPlan,
        setSelectedPlan,
        selectedWorkouts,
        addWorkout,
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
}
