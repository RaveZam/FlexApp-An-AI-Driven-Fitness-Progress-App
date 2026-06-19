import { listSessionExercisesBySession } from "@/src/lib/dao/sessionExercises";
import { useMemo } from "react";
import type { SessionExercise } from "../sessionView";

export function useGetSessionExercises(
  sessionId: string | null,
): SessionExercise[] {
  return useMemo<SessionExercise[]>(
    () => (sessionId ? listSessionExercisesBySession(sessionId) : []),
    [sessionId],
  );
}
