import { getCurrentUserId } from "@/src/lib/current-user";
import { getActiveSessionForUser } from "@/src/lib/dao/sessions";
import type { ReactNode } from "react";
import { createContext, useCallback, useMemo, useState } from "react";
import { useGetSessionExercises } from "../hooks/useGetSessionExercises";
import { resolveResumePoint } from "../services/resolveResumePoint";
import type { SessionExercise } from "../sessionView";

type SessionContextValue = {
  exercises: SessionExercise[];
  activeIndex: number;
  activeExerciseId: string | null;
  setActiveIndex: (index: number) => void;
  createdAt: string | null;
  activeSessionId: string | null;
  refreshActiveSession: () => void;
  loggedSetCount: number;
  advanceSet: () => void;
  goToNextExercise: () => void;
};

export const SessionContext = createContext<SessionContextValue | null>(null);

export function WorkoutSessionProvider({ children }: { children: ReactNode }) {
  const userId = getCurrentUserId();

  const [session, setSession] = useState(() =>
    getActiveSessionForUser(userId),
  );

  // Resolve the resume point once at mount so a continued session lands on the
  // first incomplete exercise instead of always starting at the top.
  const [resume] = useState(() => resolveResumePoint(session?.id ?? null));
  const [activeIndex, setActiveIndex] = useState(resume.index);

  const refreshActiveSession = useCallback(() => {
    setSession(getActiveSessionForUser(userId));
  }, [userId]);

  // Bumped each time a set is logged so set reads (useGetSessionSets) refetch
  // without re-reading the unchanged session row.
  const [loggedSetCount, setLoggedSetCount] = useState(0);

  const advanceSet = useCallback(() => setLoggedSetCount((c) => c + 1), []);

  // Move to the next exercise: bump the active index and reset the logged-set
  // cursor so the next exercise starts counting from its first set.
  const goToNextExercise = useCallback(() => {
    setActiveIndex((i) => i + 1);
    setLoggedSetCount(0);
  }, []);

  const createdAt = session?.createdAt ?? null;
  const activeSessionId = session?.id ?? null;

  const exercises = useGetSessionExercises(activeSessionId);

  // The active exercise's catalog id follows the cursor — derive it rather than
  // mirroring it into state, so the two can never drift out of sync.
  const activeExerciseId = exercises[activeIndex]?.catalogExerciseId ?? null;

  const value = useMemo<SessionContextValue>(
    () => ({
      exercises,
      activeIndex,
      activeExerciseId,
      setActiveIndex,
      createdAt,
      activeSessionId,
      refreshActiveSession,
      loggedSetCount,
      advanceSet,
      goToNextExercise,
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
      goToNextExercise,
    ],
  );

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}
