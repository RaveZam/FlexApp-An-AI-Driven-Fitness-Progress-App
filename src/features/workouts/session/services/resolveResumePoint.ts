import { listSessionExercisesBySession } from "@/src/lib/dao/sessionExercises";
import { listSessionSetsByExercise } from "@/src/lib/dao/sessionSets";
import { firstIncompleteExerciseIndex } from "../core/sessionSetProgress";

// Where a resumed session should pick back up: the first exercise that still
// has an unlogged set, plus that exercise's catalog id for the active-exercise
// cursor. Reads synchronously so the provider can seed its state at mount.
export function resolveResumePoint(sessionId: string | null): {
  index: number;
  catalogExerciseId: string | null;
} {
  if (!sessionId) return { index: 0, catalogExerciseId: null };
  const exercises = listSessionExercisesBySession(sessionId);
  const index = firstIncompleteExerciseIndex(
    exercises.map((ex) => listSessionSetsByExercise(ex.id)),
  );
  return {
    index,
    catalogExerciseId: exercises[index]?.catalogExerciseId ?? null,
  };
}
