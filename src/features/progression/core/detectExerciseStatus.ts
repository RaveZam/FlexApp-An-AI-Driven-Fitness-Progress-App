import type { ExerciseSessionPoint } from "../types";

export type ExerciseStatus = {
  isPlateaued: boolean;
  weight: number;
  reps: number;
  sessionsStuck: number;
};

const DEFAULT_THRESHOLD = 3;

function isPR(point: ExerciseSessionPoint, best: { weight: number; reps: number }): boolean {
  if (point.maxWeight > best.weight) return true;
  if (point.maxWeight === best.weight && point.repsAtMax > best.reps) return true;
  return false;
}

// Mirrors src/features/home/core/detectPlateaus.ts, adapted to ExerciseSessionPoint
// (single-exercise series rather than a batch of ExerciseProgress).
export function detectExerciseStatus(
  points: ExerciseSessionPoint[],
  threshold: number = DEFAULT_THRESHOLD,
): ExerciseStatus {
  let best = { weight: 0, reps: 0 };
  const prFlags: boolean[] = [];

  for (const point of points) {
    const pr = isPR(point, best);
    prFlags.push(pr);
    if (pr) best = { weight: point.maxWeight, reps: point.repsAtMax };
  }

  const hasEnoughHistory = points.length >= threshold + 1;
  const lastN = prFlags.slice(-threshold);
  const isPlateaued = hasEnoughHistory && lastN.every((pr) => !pr);

  return { isPlateaued, weight: best.weight, reps: best.reps, sessionsStuck: threshold };
}
