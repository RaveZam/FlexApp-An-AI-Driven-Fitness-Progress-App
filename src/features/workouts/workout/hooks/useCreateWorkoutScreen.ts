import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Alert } from "react-native";
import type { CatalogExercise } from "../../types";
import { useCreateWorkout } from "./useCreateWorkout";

export type ExerciseDraft = {
  key: string;
  catalogExercise: CatalogExercise;
  targetSets: string;
  targetReps: string;
};

let keyCounter = 0;
const nextKey = () => String(++keyCounter);

export function useCreateWorkoutScreen() {
  const router = useRouter();
  const { planId } = useLocalSearchParams<{ planId: string }>();
  const { createWorkout, saving } = useCreateWorkout();

  const [name, setName] = useState("");
  const [daysOfWeek, setDaysOfWeek] = useState<number[]>([]);
  const [exercises, setExercises] = useState<ExerciseDraft[]>([]);
  const [pickerVisible, setPickerVisible] = useState(false);

  const openPicker = useCallback(() => setPickerVisible(true), []);
  const closePicker = useCallback(() => setPickerVisible(false), []);

  function toggleDay(day: number) {
    setDaysOfWeek((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  }

  function addExercise(catalog: CatalogExercise) {
    setExercises((prev) => [
      ...prev,
      {
        key: nextKey(),
        catalogExercise: catalog,
        targetSets: "3",
        targetReps: "10",
      },
    ]);
  }

  function removeExercise(key: string) {
    setExercises((prev) => prev.filter((e) => e.key !== key));
  }

  function changeExercise(
    key: string,
    field: "targetSets" | "targetReps",
    value: string
  ) {
    setExercises((prev) =>
      prev.map((e) =>
        e.key === key ? { ...e, [field]: value.replace(/[^0-9]/g, "") } : e
      )
    );
  }

  async function save() {
    if (!planId) return Alert.alert("Error", "No plan selected.");
    const trimmed = name.trim();
    if (!trimmed) return Alert.alert("Name required", "Please enter a workout name.");
    if (exercises.length === 0) return Alert.alert("No exercises", "Add at least one exercise.");

    for (const e of exercises) {
      const sets = parseInt(e.targetSets, 10);
      const reps = parseInt(e.targetReps, 10);
      if (!sets || sets < 1 || !reps || reps < 1) {
        return Alert.alert(
          "Invalid sets/reps",
          `"${e.catalogExercise.name}" needs valid sets and reps (≥ 1).`
        );
      }
    }

    await createWorkout({
      planId,
      name: trimmed,
      daysOfWeek,
      exercises: exercises.map((e) => ({
        catalogExerciseId: e.catalogExercise.id,
        name: e.catalogExercise.name,
        targetSets: parseInt(e.targetSets, 10),
        targetReps: parseInt(e.targetReps, 10),
        isUnilateral: e.catalogExercise.isUnilateral,
      })),
    });

    router.back();
  }

  return {
    form: {
      name,
      daysOfWeek,
      exercises,
      saving,
      pickerVisible,
      actions: {
        setName,
        toggleDay,
        addExercise,
        removeExercise,
        changeExercise,
        save,
        openPicker,
        closePicker,
      },
    },
  };
}
