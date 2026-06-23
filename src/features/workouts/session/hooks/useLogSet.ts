import { useCallback } from "react";
import { parseSetInput } from "../core/parseSetInput";
import logSet from "../services/logSet";
import { useWorkoutSession } from "./useWorkoutSession";

type LogSetInput = {
  sessionExerciseId: string;
  weight: string;
  reps: string;
  leftReps: string;
  rightReps: string;
  isUnilateral: boolean;
};

// Parses the modal's raw text fields, then writes the set via the logSet
// service. Returns the set id written, or null when the input is invalid or
// every set is already logged. On a successful write it advances the set cursor
// so set reads (useGetSessionSets) refetch in place.
export function useLogSet() {
  const { advanceSet } = useWorkoutSession();

  return useCallback(
    ({
      sessionExerciseId,
      weight,
      reps,
      leftReps,
      rightReps,
      isUnilateral,
    }: LogSetInput) => {
      const parsed = parseSetInput(
        { weight, reps, leftReps, rightReps },
        isUnilateral,
      );

      if (!parsed) return null;

      const setId = logSet({ sessionExerciseId, ...parsed });
      if (setId) advanceSet();
      return setId;
    },
    [advanceSet],
  );
}
