import type { WorkoutExerciseRow } from "@/src/lib/dao/workoutExercises";
import type { ReactNode } from "react";
import { createContext, useMemo, useState } from "react";
import { useGetCurrentWorkoutExercises } from "../hooks/useGetCurrentWorkoutExercises";


type SessionContextValue = {
  exercises: WorkoutExerciseRow[];
  activeIndex: number;
  setActiveIndex: (index: number) => void;
};

export const SessionContext = createContext<SessionContextValue | null>(null);




export function WorkoutSessionProvider({ children }: { children: ReactNode }) {
 
  const exercises: WorkoutExerciseRow[] = useGetCurrentWorkoutExercises();
  const [activeIndex, setActiveIndex] = useState(0);


  const value = useMemo<SessionContextValue>(
    () => ({ exercises, activeIndex, setActiveIndex }),
    [exercises, activeIndex]
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

