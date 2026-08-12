import { getCurrentUserId } from "@/src/lib/current-user";
import {
  listSessionSetsForExercise,
  type SessionSetDetail,
} from "@/src/lib/dao/exerciseStats";
import { useMemo } from "react";

export function useExerciseSessionSets(
  sessionId: string | null,
  exerciseName: string,
): { sets: SessionSetDetail[] } {
  const userId = getCurrentUserId();

  const sets = useMemo<SessionSetDetail[]>(() => {
    if (!sessionId) return [];
    return listSessionSetsForExercise(userId, sessionId, exerciseName);
  }, [userId, sessionId, exerciseName]);

  return { sets };
}
