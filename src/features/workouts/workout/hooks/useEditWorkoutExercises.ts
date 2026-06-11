import { useAuth } from "@/src/features/auth";
import { generateUUID } from "@/src/lib/uuid";
import { useState } from "react";
import {
  addExerciseToWorkout,
  removeExerciseFromWorkout,
  updateExerciseTargets,
} from "../../services/workoutLocalService";
import type { CatalogExercise, Exercise } from "../../types";

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
      isUnilateral: catalog.isUnilateral,
      createdAt: now,
    };

    addExerciseToWorkout(exercise);
    onRefresh();
  }

  function updateTargets(exerciseId: string, targetSets: number, targetReps: number) {
    updateExerciseTargets(exerciseId, targetSets, targetReps);
    onRefresh();
  }

  return {
    selectedIds,
    toggleSelect,
    removeSelected,
    updateTargets,
    pickerVisible,
    setPickerVisible,
    addExercise,
  };
}
