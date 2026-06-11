import { useAuth } from "@/src/features/auth";
import { listLoggedWorkouts } from "@/src/features/home/services/ProgressiveOverloadDao/progressiveOverloadDao";
import type {
  ExerciseProgress,
  LoggedWorkout,
} from "@/src/features/home/types/progressiveOverload";
import { useMemo } from "react";

export const ALL_BODY_PARTS = "All";

// Catalog muscle_group values aren't consistently cased/trimmed, so collapse
// them to one canonical form for grouping, chips, and filtering.
function normalizeGroup(group: string | null): string | null {
  const trimmed = group?.trim().toLowerCase();
  return trimmed ? trimmed : null;
}

// Pivot sessions (newest first) into one series per exercise, keeping each
// session's heaviest completed set as the data point for the chart.
function toExerciseProgress(workouts: LoggedWorkout[]): ExerciseProgress[] {
  const byName = new Map<string, ExerciseProgress>();

  for (const workout of workouts) {
    for (const exercise of workout.exercises) {
      let topWeight = 0;
      let topReps = 0;
      for (const set of exercise.sets) {
        if (!set.completed) continue;
        const weight = set.weight ?? 0;
        // Unilateral sets log per-side reps; total work is both sides combined.
        const reps = exercise.isUnilateral
          ? (set.actualRepsLeft ?? 0) + (set.actualRepsRight ?? 0)
          : set.actualReps ?? 0;
        if (weight > topWeight || (weight === topWeight && reps > topReps)) {
          topWeight = weight;
          topReps = reps;
        }
      }

      const entry =
        byName.get(exercise.name) ??
        { name: exercise.name, muscleGroup: normalizeGroup(exercise.muscleGroup), points: [] };
      entry.points.push({
        sessionId: workout.id,
        completedAt: workout.completedAt,
        weight: topWeight,
        reps: topReps,
      });
      byName.set(exercise.name, entry);
    }
  }

  // Sessions arrive newest first; reverse each series to chronological order.
  return [...byName.values()].map((e) => ({ ...e, points: e.points.reverse() }));
}

export function useProgressiveOverload(bodyFilter: string = ALL_BODY_PARTS) {
  const { user } = useAuth();

  const all = useMemo<ExerciseProgress[]>(() => {
    if (!user) return [];
    return toExerciseProgress(listLoggedWorkouts(user.id));
  }, [user]);

  const muscleGroups = useMemo(() => {
    const groups = new Set<string>();
    for (const e of all) if (e.muscleGroup) groups.add(e.muscleGroup);
    return [...groups].sort();
  }, [all]);

  const exercises = useMemo(() => {
    if (bodyFilter === ALL_BODY_PARTS) return all;
    return all.filter((e) => e.muscleGroup === bodyFilter);
  }, [all, bodyFilter]);

  return { exercises, muscleGroups };
}
