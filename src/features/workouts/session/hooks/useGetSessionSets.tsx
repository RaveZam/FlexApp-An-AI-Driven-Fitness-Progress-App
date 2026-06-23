import {
  listSessionSetsByExercise,
  SessionSetRow,
} from "@/src/lib/dao/sessionSets";
import { useMemo } from "react";
import { useWorkoutSession } from "./useWorkoutSession";

export function useGetSessionSets(sessionExerciseId: string): SessionSetRow[] {
  const { loggedSetCount } = useWorkoutSession();
  return useMemo(
    () => listSessionSetsByExercise(sessionExerciseId),
    [sessionExerciseId, loggedSetCount],
  );
}
