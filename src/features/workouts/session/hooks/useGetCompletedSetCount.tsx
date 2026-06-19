import { listSessionSetsByExercise } from "@/src/lib/dao/sessionSets";
import { useMemo } from "react";

// How many of an exercise's session_sets have been logged (completed), used to
// show logged-vs-planned progress without pulling the full set rows into the UI.
export function useGetCompletedSetCount(sessionExerciseId: string): number {
  return useMemo(
    () =>
      listSessionSetsByExercise(sessionExerciseId).filter((s) => s.completed)
        .length,
    [sessionExerciseId],
  );
}
