import { useAuth } from "@/src/features/auth";
import { getActiveSessionForUser } from "@/src/lib/dao/sessions";
import type { ReactNode } from "react";
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useGetSessionExercises } from "../hooks/useGetSessionExercises";
import type { SessionExercise } from "../sessionView";

type SessionContextValue = {
  exercises: SessionExercise[];
  activeIndex: number;
  activeExerciseId: string | null;
  setActiveIndex: (index: number) => void;
  setActiveExerciseId: (id: string | null) => void;
  createdAt: string | null;
  activeSessionId: string | null;
  refreshActiveSession: () => void;
  loggedSetCount: number;
  advanceSet: () => void;
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

  // Bumped each time a set is logged so set reads (useGetSessionSets) refetch
  // without re-reading the unchanged session row.
  const [loggedSetCount, setLoggedSetCount] = useState(0);

  const advanceSet = useCallback(() => setLoggedSetCount((c) => c + 1), []);

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
      loggedSetCount,
      advanceSet,
    }),
    [
      exercises,
      activeIndex,
      activeExerciseId,
      createdAt,
      activeSessionId,
      refreshActiveSession,
      loggedSetCount,
      advanceSet,
    ],
  );

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}
