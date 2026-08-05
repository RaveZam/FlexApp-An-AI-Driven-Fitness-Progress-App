import type { ExercisePoint } from "@/src/features/home/types/progressiveOverload";

// Percent change in top-set volume (weight * reps) from the first to the
// latest logged session. Null when there's nothing to compare against yet.
export function computeVolumeDeltaPct(points: ExercisePoint[]): number | null {
  if (points.length <= 1) return null;

  const volumes = points.map((pt) => pt.weight * pt.reps);
  const first = volumes[0] ?? 0;
  const last = volumes[volumes.length - 1] ?? 0;

  return first > 0 ? Math.round(((last - first) / first) * 100) : null;
}
