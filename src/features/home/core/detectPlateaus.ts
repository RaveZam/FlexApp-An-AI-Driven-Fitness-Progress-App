import type { ExercisePoint, ExerciseProgress } from "@/src/features/home/types/progressiveOverload";

export type PlateauResult = {
  name: string;
  muscleGroup: string | null;
  weight: number;
  reps: number;
  sessionsStuck: number;
  lastImprovedAt: string | null;
};

const DEFAULT_THRESHOLD = 3;

function isPR(point: ExercisePoint, best: { weight: number; reps: number }): boolean {
  if (point.weight > best.weight) return true;
  if (point.weight === best.weight && point.reps > best.reps) return true;
  return false;
}

// An exercise "plateaus" when its last `threshold` sessions produced no new
// PR on its top set (heavier weight, or same weight with more reps). Needs
// at least threshold+1 sessions of history so the first session's trivial
// PR can't itself count toward the stuck streak.
export function detectPlateaus(
  exercises: ExerciseProgress[],
  threshold: number = DEFAULT_THRESHOLD,
): PlateauResult[] {
  const results: PlateauResult[] = [];

  for (const exercise of exercises) {
    const { points } = exercise;
    if (points.length < threshold + 1) continue;

    let best = { weight: 0, reps: 0 };
    let lastImprovedAt: string | null = null;
    const prFlags: boolean[] = [];

    for (const point of points) {
      const pr = isPR(point, best);
      prFlags.push(pr);
      if (pr) {
        best = { weight: point.weight, reps: point.reps };
        lastImprovedAt = point.completedAt;
      }
    }

    const lastN = prFlags.slice(-threshold);
    const plateaued = lastN.every((pr) => !pr);
    if (!plateaued) continue;

    results.push({
      name: exercise.name,
      muscleGroup: exercise.muscleGroup,
      weight: best.weight,
      reps: best.reps,
      sessionsStuck: threshold,
      lastImprovedAt,
    });
  }

  return results;
}
