import {
  listSessionExercisesBySession,
  SessionExerciseRow,
} from "@/src/lib/dao/sessionExercises";
import { useMemo } from "react";

export function useGetSessionExercises(
  sessionId: string | null,
): SessionExerciseRow[] {
  return useMemo<SessionExerciseRow[]>(
    () => (sessionId ? listSessionExercisesBySession(sessionId) : []),
    [sessionId],
  );
}
