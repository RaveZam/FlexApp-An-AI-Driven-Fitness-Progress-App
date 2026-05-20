import { enqueueOutbox } from "@/src/features/outbox";
import { useAuth } from "@/src/features/auth/hooks/useAuth";
import { generateUUID } from "@/src/lib/uuid";
import { useState } from "react";
import {
  addExerciseToWorkout,
  removeExerciseFromWorkout,
} from "../services/workoutLocalService";
import type { CatalogExercise, Exercise } from "../types";

export function useEditWorkoutExercises(
  workoutId: string,
  exercises: Exercise[],
  onRefresh: () => void
) {
  const { session } = useAuth();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [pickerVisible, setPickerVisible] = useState(false);

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function removeSelected() {
    for (const id of selectedIds) {
      removeExerciseFromWorkout(id);
      enqueueOutbox({
        entityType: "workout_exercise",
        entityId: id,
        operation: "delete",
        payload: {},
      });
    }
    setSelectedIds(new Set());
    onRefresh();
  }

  function addExercise(catalog: CatalogExercise) {
    if (!session?.user.id) return;
    const now = new Date().toISOString();
    const nextPosition = exercises.length;
    const exercise: Exercise = {
      id: generateUUID(),
      workoutId,
      userId: session.user.id,
      name: catalog.name,
      catalogExerciseId: catalog.id,
      targetSets: 3,
      targetReps: 10,
      position: nextPosition,
      createdAt: now,
    };

    addExerciseToWorkout(exercise);
    enqueueOutbox({
      entityType: "workout_exercise",
      entityId: exercise.id,
      operation: "create",
      payload: {
        exercise: {
          id: exercise.id,
          workout_id: exercise.workoutId,
          user_id: exercise.userId,
          name: exercise.name,
          catalog_exercise_id: exercise.catalogExerciseId,
          target_sets: exercise.targetSets,
          target_reps: exercise.targetReps,
          position: exercise.position,
          created_at: exercise.createdAt,
        },
      },
    });
    onRefresh();
  }

  return {
    selectedIds,
    toggleSelect,
    removeSelected,
    pickerVisible,
    setPickerVisible,
    addExercise,
  };
}
