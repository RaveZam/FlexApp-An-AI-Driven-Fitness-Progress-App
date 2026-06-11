import { generateUUID } from "@/src/lib/uuid";
import { useState } from "react";
import { useAuth } from "@/src/features/auth";
import { insertWorkoutLocal } from "../services/workoutLocalService";
import type { Workout, WorkoutInput } from "../types";

export function useCreateWorkout() {
  const { session } = useAuth();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function createWorkout(input: WorkoutInput): Promise<Workout> {
    if (!session?.user.id) throw new Error("Not authenticated");

    setSaving(true);
    setError(null);

    try {
      const now = new Date().toISOString();
      const workoutId = generateUUID();
      const userId = session.user.id;

      const workout: Workout = {
        id: workoutId,
        userId,
        planId: input.planId,
        name: input.name.trim(),
        daysOfWeek: input.daysOfWeek,
        createdAt: now,
        updatedAt: now,
        exercises: input.exercises.map((ex, index) => ({
          id: generateUUID(),
          workoutId,
          userId,
          name: ex.name.trim(),
          catalogExerciseId: ex.catalogExerciseId,
          targetSets: ex.targetSets,
          targetReps: ex.targetReps,
          position: index,
          isUnilateral: ex.isUnilateral,
          createdAt: now,
        })),
      };

      insertWorkoutLocal(workout);

      return workout;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to create workout";
      setError(msg);
      throw err;
    } finally {
      setSaving(false);
    }
  }

  return { createWorkout, saving, error };
}
