import type { Workout } from "@/src/features/workouts";
import { getCurrentUserId } from "@/src/lib/current-user";
import { resolveActiveWorkoutId } from "@/src/lib/dao/preferences";
import { listWorkoutDaysByWorkoutIds } from "@/src/lib/dao/workoutDays";
import { listWorkoutExercisesByWorkout } from "@/src/lib/dao/workoutExercises";
import { getWorkoutById } from "@/src/lib/dao/workouts";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import useGetActivePlan from "./useGetActivePlan";

export default function useGetActiveWorkout() {
  const userId = getCurrentUserId();
  const activePlanId = useGetActivePlan();
  const [activeWorkout, setActiveWorkout] = useState<Workout | null>(null);

  const load = useCallback(() => {
    if (!activePlanId) {
      setActiveWorkout(null);
      return;
    }
    const workoutId = resolveActiveWorkoutId(userId, activePlanId);
    const workout = getWorkoutById(workoutId);
    if (!workout) {
      setActiveWorkout(null);
      return;
    }
    const daysOfWeek =
      listWorkoutDaysByWorkoutIds([workout.id]).get(workout.id) ?? [];
    const exercises = listWorkoutExercisesByWorkout(workout.id);
    setActiveWorkout({ ...workout, daysOfWeek, exercises });
  }, [activePlanId, userId]);

  useFocusEffect(load);

  return { workout: activeWorkout, refresh: load };
}
