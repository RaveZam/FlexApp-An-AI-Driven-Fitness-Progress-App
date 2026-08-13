import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { groupExercisesByMuscle } from "../core/exerciseGroups";
import type { CatalogExercise } from "../../types";
import { useEditWorkoutExercises } from "./useEditWorkoutExercises";
import { useWorkouts } from "./useWorkouts";

export function useWorkoutDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { workouts, refresh, refreshLocal } = useWorkouts();
  const [editing, setEditing] = useState(false);

  const workout = workouts.find((w) => w.id === id);

  const {
    selectedIds,
    toggleSelect,
    removeSelected,
    updateTargets,
    pickerVisible,
    setPickerVisible,
    addExercise,
  } = useEditWorkoutExercises(id, workout?.exercises ?? [], refreshLocal);

  const { groups, showHeaders } = useMemo(
    () => groupExercisesByMuscle(workout?.exercises ?? []),
    [workout?.exercises]
  );

  const goBack = useCallback(() => {
    if (editing) setEditing(false);
    else router.back();
  }, [editing, router]);

  const toggleEditing = useCallback(() => setEditing((e) => !e), []);

  const openPicker = useCallback(() => setPickerVisible(true), [setPickerVisible]);
  const closePicker = useCallback(() => setPickerVisible(false), [setPickerVisible]);

  const pickExercise = useCallback(
    (catalog: CatalogExercise) => {
      addExercise(catalog);
      setPickerVisible(false);
    },
    [addExercise, setPickerVisible]
  );

  return {
    workout,
    editing,
    goBack,
    toggleEditing,
    refreshDays: refresh,
    groups,
    showHeaders,
    selectedIds,
    toggleSelect,
    removeSelected,
    updateTargets,
    pickerVisible,
    openPicker,
    closePicker,
    pickExercise,
  };
}
