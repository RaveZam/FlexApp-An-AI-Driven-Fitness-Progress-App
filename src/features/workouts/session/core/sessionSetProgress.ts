import type { SessionSetRow } from "@/src/lib/dao/sessionSets";

// The current set is the first unlogged one; -1 / null when every set is done.
export function currentSetIndex(sets: SessionSetRow[]): number {
  return sets.findIndex((s) => !s.completed);
}

export function currentSet(sets: SessionSetRow[]): SessionSetRow | null {
  const i = currentSetIndex(sets);
  return i === -1 ? null : sets[i];
}

// The resume point across exercises: the first exercise that still has an
// unlogged set. Returns 0 when every set is done.
export function firstIncompleteExerciseIndex(
  setsPerExercise: SessionSetRow[][],
): number {
  const i = setsPerExercise.findIndex((sets) => currentSetIndex(sets) !== -1);
  return i === -1 ? 0 : i;
}
