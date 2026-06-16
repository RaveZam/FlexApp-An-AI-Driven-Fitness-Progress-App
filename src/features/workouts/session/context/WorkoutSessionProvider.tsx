import type { SessionExerciseView } from "@/src/features/workouts/session/sessionView";
import type { ReactNode } from "react";
import { createContext, useEffect, useMemo, useState } from "react";


type SessionContextValue = {
  exercises: SessionExerciseView[];
  activeIndex: number;
  setActiveIndex: (index: number) => void;
};

export const SessionContext = createContext<SessionContextValue | null>(null);




export function WorkoutSessionProvider({ children }: { children: ReactNode }) {
 
  
  useEffect(() => {
    if (workouts && workouts.length > 0) {
      const sessionExercises: SessionExerciseView[] = [];
      setExercises(sessionExercises);
    }
  }, [workouts]);

  const [exercises, setExercises] = useState<SessionExerciseView[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const value = useMemo<SessionContextValue>(
    () => ({ exercises, activeIndex, setActiveIndex }),
    [exercises, activeIndex]
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

