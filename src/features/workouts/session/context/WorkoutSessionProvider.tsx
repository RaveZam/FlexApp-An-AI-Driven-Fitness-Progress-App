import { useAuth } from "@/src/features/auth";
import type { SessionExerciseRow } from "@/src/lib/dao/sessionExercises";
import { getActiveSessionForUser } from "@/src/lib/dao/sessions";
import type { ReactNode } from "react";
import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { useGetSessionExercises } from "../hooks/useGetSessionExercises";

type SessionContextValue = {
  exercises: SessionExerciseRow[];
  activeIndex: number;
  activeExerciseId: string | null;
  setActiveIndex: (index: number) => void;
  setActiveExerciseId: (id: string | null) => void;
  createdAt: string | null;
  activeSessionId: string | null;
  refreshActiveSession: () => void;
};

export const SessionContext = createContext<SessionContextValue | null>(null);

export function WorkoutSessionProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeExerciseId, setActiveExerciseId] = useState<string | null>(null);

  const [session, setSession] = useState(() =>
    getActiveSessionForUser(user?.id ?? ""),
  );

  const refreshActiveSession = useCallback(() => {
    setSession(getActiveSessionForUser(user?.id ?? ""));
  }, [user?.id]);

  const createdAt = session?.createdAt ?? null;
  const activeSessionId = session?.id ?? null;

  const exercises = useGetSessionExercises(activeSessionId);

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
      activeSessionId,
      refreshActiveSession,
    }),
    [
      exercises,
      activeIndex,
      activeExerciseId,
      createdAt,
      activeSessionId,
      refreshActiveSession,
    ],
  );

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}
