import { getCurrentUserId } from "@/src/lib/current-user";
import { getBestRecordByCatalogId } from "@/src/lib/dao/exerciseStats";
import type { ExerciseBestRecord } from "../sessionView";

export function useGetExercisePR(
  catalogExerciseId: string | null
): ExerciseBestRecord | null {
  const userId = getCurrentUserId();

  if (!catalogExerciseId) return null;

  const row = getBestRecordByCatalogId(userId, catalogExerciseId);
  if (!row) return null;

  return {
    weight: row.weight,
    reps: row.actualReps ?? 0,
    date: row.completedAt ?? row.startedAt,
  };
}
