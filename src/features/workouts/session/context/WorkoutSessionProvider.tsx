import { useAuth } from "@/src/features/auth";
import { getActiveSessionForUser } from "@/src/lib/dao/sessions";
import type { WorkoutExerciseRow } from "@/src/lib/dao/workoutExercises";
import type { ReactNode } from "react";
import { createContext, useEffect, useMemo, useState } from "react";
import { useGetCurrentWorkoutExercises } from "../hooks/useGetCurrentWorkoutExercises";

type SessionContextValue = {
  exercises: WorkoutExerciseRow[];
  activeIndex: number;
  activeExerciseId: string | null;
  setActiveIndex: (index: number) => void;
  setActiveExerciseId: (id: string | null) => void;
  createdAt: string | null;
};

export const SessionContext = createContext<SessionContextValue | null>(null);

export function WorkoutSessionProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const exercises: WorkoutExerciseRow[] = useGetCurrentWorkoutExercises();
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeExerciseId, setActiveExerciseId] = useState<string | null>(null);

  if (!user) {
    return null;
  }
  const session = getActiveSessionForUser(user.id);

  if (!session) {
    return null;
  }
  const createdAt = session.createdAt;

  useEffect(() => {
    if (exercises.length > 0) {
      const activeExercise = exercises[activeIndex];
      const catalogExerciseId = activeExercise?.catalogExerciseId ?? null;
      setActiveExerciseId(catalogExerciseId);
    }
  }, [activeIndex]);

  const value = useMemo<SessionContextValue>(
    () => ({
      exercises,
      activeIndex,
      activeExerciseId,
      setActiveIndex,
      setActiveExerciseId,
      createdAt,
    }),
    [exercises, activeIndex, activeExerciseId, createdAt],
  );

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}
