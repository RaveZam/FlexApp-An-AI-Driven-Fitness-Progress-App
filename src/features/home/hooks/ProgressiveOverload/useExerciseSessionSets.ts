import { useAuth } from "@/src/features/auth";
import {
  listSessionSetsForExercise,
  type SessionSetDetail,
} from "@/src/lib/dao/exerciseStats";
import { useMemo } from "react";

export function useExerciseSessionSets(
  sessionId: string | null,
  exerciseName: string,
): { sets: SessionSetDetail[] } {
  const { user } = useAuth();

  const sets = useMemo<SessionSetDetail[]>(() => {
    if (!user?.id || !sessionId) return [];
    return listSessionSetsForExercise(user.id, sessionId, exerciseName);
  }, [user?.id, sessionId, exerciseName]);

  return { sets };
}
