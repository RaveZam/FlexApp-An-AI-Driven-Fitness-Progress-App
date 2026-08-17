import type { ExerciseProgress } from "@/src/features/home/types/progressiveOverload";
import type { UserExerciseTopSetRow } from "@/src/lib/dao/exerciseStats";

// Pivots per-exercise, per-session top-set rows into one series per
// exercise. Rows already come from the DAO capped to each exercise's own
// recent session window and sorted chronologically ascending, so this is a
// pure grouping step — no re-sorting or slicing here.
export function toExerciseProgress(
  rows: UserExerciseTopSetRow[],
): ExerciseProgress[] {
  const grouped = new Map<string, UserExerciseTopSetRow[]>();

  for (const row of rows) {
    const list = grouped.get(row.exerciseName) ?? [];
    list.push(row);
    grouped.set(row.exerciseName, list);
  }

  return [...grouped.entries()]
    .sort((a, b) => b[1].length - a[1].length)
    .map(([name, sessions]) => ({
      name,
      muscleGroup: sessions[0]?.muscleGroup ?? null,
      points: sessions.map((row) => ({
        sessionId: row.sessionId,
        startedAt: row.startedAt,
        weight: row.weight,
        reps: row.actualReps ?? 0,
      })),
    }));
}
