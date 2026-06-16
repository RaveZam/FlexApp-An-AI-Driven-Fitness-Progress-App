import { useAuth } from "@/src/features/auth/hooks/useAuth";
import { getBestRecordByCatalogId } from "@/src/lib/dao/exerciseStats";
import type { ExerciseBestRecord } from "../sessionView";

export function useGetExercisePR(
  catalogExerciseId: string | null
): ExerciseBestRecord | null {
  const { user } = useAuth();

  if (!user || !catalogExerciseId) return null;

  const row = getBestRecordByCatalogId(user.id, catalogExerciseId);
  if (!row) return null;

  return {
    weight: row.weight,
    reps: row.actualReps ?? 0,
    date: row.completedAt ?? row.startedAt,
  };
}
