import { getCurrentUserId } from "@/src/lib/current-user";
import { listRecentTopSetsByCatalogId } from "@/src/lib/dao/exerciseStats";

export type ExerciseSessionPoint = {
  sessionId: string;
  startedAt: string;
  maxWeight: number;
  repsAtMax: number;
};

export function useGetLast7TopSetsExercise(
  catalogExerciseId: string | null,
): ExerciseSessionPoint[] {
  const userId = getCurrentUserId();

  if (!catalogExerciseId) return [];

  return listRecentTopSetsByCatalogId(userId, catalogExerciseId, 7).map(
    (r) => ({
      sessionId: r.sessionId,
      startedAt: r.startedAt,
      maxWeight: r.weight,
      repsAtMax: r.actualReps ?? 0,
    }),
  );
}
