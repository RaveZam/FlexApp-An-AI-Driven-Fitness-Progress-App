import { useWorkoutPlanCreator } from "@/hooks/useWorkoutPlanCreator";
import { createContext } from "react";

type WorkoutContextType = {
  selectedPlan: string;
  setSelectedPlan: React.Dispatch<React.SetStateAction<string>>;
  selectedDay: string;
  setSelectedDay: React.Dispatch<React.SetStateAction<string>>;
  selectedWorkouts: any[];
  // addWorkout: (workout_name: string, id: number, workout_image: string) => void;
  // repsPerSet: any[];
  // setRepsPerSet: React.Dispatch<React.SetStateAction<any[]>>;
  step: number;
  setStep: React.Dispatch<React.SetStateAction<any>>;
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
    step,
    setStep,
    // addWorkout,
    // repsPerSet,
    // setRepsPerSet,
  } = useWorkoutPlanCreator();

  return (
    <WorkoutContext.Provider
      value={{
        selectedDay,
        setSelectedDay,
        selectedPlan,
        setSelectedPlan,
        selectedWorkouts,
        step,
        setStep,
        // addWorkout,
        // repsPerSet,
        // setRepsPerSet,
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
}
