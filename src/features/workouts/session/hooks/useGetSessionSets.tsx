import {
  listSessionSetsByExercise,
  SessionSetRow,
} from "@/src/lib/dao/sessionSets";
import { useMemo } from "react";

export function useGetSessionSets(sessionExerciseId: string): SessionSetRow[] {
  return useMemo(
    () => listSessionSetsByExercise(sessionExerciseId),
    [sessionExerciseId],
  );
}
