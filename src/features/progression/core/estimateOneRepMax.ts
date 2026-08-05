// Epley formula. At reps <= 1 the set already is the max, no extrapolation needed.
export function estimateOneRepMax(weight: number, reps: number): number {
  if (reps <= 1) return Math.round(weight);
  return Math.round(weight * (1 + reps / 30));
}
