import { createContext } from "react";
import { useWorkoutPlanCreator } from "@/hooks/useWorkoutPlanCreator";

type WorkoutContextType = {
  selectedPlan: string;
  setSelectedPlan: React.Dispatch<React.SetStateAction<string>>;
  selectedDay: string;
  setSelectedDay: React.Dispatch<React.SetStateAction<string>>;
};

export const WorkoutContext = createContext<WorkoutContextType | undefined>(
  undefined
);

export default function workoutContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { selectedPlan, setSelectedPlan, selectedDay, setSelectedDay } =
    useWorkoutPlanCreator();

  return (
    <WorkoutContext.Provider
      value={{ selectedDay, setSelectedDay, selectedPlan, setSelectedPlan }}
    >
      {children}
    </WorkoutContext.Provider>
  );
}
