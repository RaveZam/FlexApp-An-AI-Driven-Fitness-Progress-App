import type { ExerciseProgress } from "@/src/features/home/types/progressiveOverload";
import type { UserExerciseTopSetRow } from "@/src/lib/dao/exerciseStats";

// Catalog muscle_group values aren't consistently cased/trimmed, so collapse
// them to one canonical form for grouping, chips, and filtering.
function normalizeGroup(group: string | null): string | null {
  const trimmed = group?.trim().toLowerCase();
  return trimmed ? trimmed : null;
}

// Pivot per-session top-set rows (already the heaviest completed set per
// exercise per session — see listRecentTopSetsByUser) into one series per
// exercise. Each exercise's series is capped to its own last
// `perExerciseLimit` occurrences rather than a shared session window — on a
// split routine, most sessions don't touch a given exercise at all, so a
// flat session-count cutoff starves exercises trained less often (e.g. chest
// day only 2 out of 7 recent sessions).
export function toExerciseProgress(
  rows: UserExerciseTopSetRow[],
  perExerciseLimit = 7,
): ExerciseProgress[] {
  const grouped = new Map<string, UserExerciseTopSetRow[]>();

  for (const row of rows) {
    const list = grouped.get(row.exerciseName) ?? [];
    list.push(row);
    grouped.set(row.exerciseName, list);
  }

  // Most-conducted exercise first — ranked by total occurrences, not just
  // the capped window below, so an exercise done often but not in the last
  // `perExerciseLimit` sessions still ranks above one done only a couple of
  // times ever.
  const orderedEntries = [...grouped.entries()].sort(
    (a, b) => b[1].length - a[1].length,
  );

  return orderedEntries.map(([name, sessions]) => {
    // Newest first, so the occurrence cap keeps the most recent sessions.
    sessions.sort((a, b) => (a.startedAt < b.startedAt ? 1 : -1));
    const capped = sessions.slice(0, perExerciseLimit);

    return {
      name,
      muscleGroup: normalizeGroup(capped[0]?.muscleGroup ?? null),
      // Chronological order for the chart.
      points: capped
        .map((row) => ({
          sessionId: row.sessionId,
          startedAt: row.startedAt,
          weight: row.weight,
          reps: row.actualReps ?? 0,
        }))
        .reverse(),
    };
  });
}
