import { useAuth } from "@/src/features/auth/hooks/useAuth";
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
  const { user } = useAuth();

  if (!user || !catalogExerciseId) return [];

  return listRecentTopSetsByCatalogId(user.id, catalogExerciseId, 7).map(
    (r) => ({
      sessionId: r.sessionId,
      startedAt: r.startedAt,
      maxWeight: r.weight,
      repsAtMax: r.actualReps ?? 0,
    }),
  );
}
