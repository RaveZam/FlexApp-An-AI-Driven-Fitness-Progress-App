import type { SessionExerciseView, SessionSetView } from "@/src/features/workouts/session/sessionView";

export function getEditingSet(
  editingSetId: string | null,
  active: SessionExerciseView | null
): SessionSetView | null {
  if (!editingSetId) return null;
  return active?.sets.find((s) => s.id === editingSetId) ?? null;
}

export function getCompletedSetCount(exercises: SessionExerciseView[]): number {
  return exercises.reduce(
    (acc, ex) => acc + ex.sets.filter((s) => s.completed).length,
    0
  );
}

export type BottomMode = "log" | "next" | "finish";

export function getBottomMode(
  allExercisesComplete: boolean,
  allSetsComplete: boolean
): BottomMode {
  if (allExercisesComplete) return "finish";
  if (allSetsComplete) return "next";
  return "log";
}

export function getProgressPct(
  exercises: SessionExerciseView[],
  activeIndex: number,
  allSetsComplete: boolean
): number {
  return exercises.length
    ? ((activeIndex + (allSetsComplete ? 1 : 0)) / exercises.length) * 100
    : 0;
}
