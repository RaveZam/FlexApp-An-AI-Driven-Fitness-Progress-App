import type { Workout } from "@/src/features/workouts";
import { resolveActiveWorkoutId } from "@/src/lib/dao/preferences";
import { listWorkoutDaysByWorkoutIds } from "@/src/lib/dao/workoutDays";
import { listWorkoutExercisesByWorkout } from "@/src/lib/dao/workoutExercises";
import { getWorkoutById, getWorkoutIDForDay } from "@/src/lib/dao/workouts";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { useAuth } from "../../auth";
import useGetActivePlan from "./useGetActivePlan";

export default function useGetActiveWorkout() {
  const { user } = useAuth();
  const activePlanId = useGetActivePlan();
  const [activeWorkout, setActiveWorkout] = useState<Workout | null>(null);

  const load = useCallback(() => {
    if (!activePlanId) {
      setActiveWorkout(null);
      return;
    }
    const workoutId = user?.id
      ? resolveActiveWorkoutId(user.id, activePlanId)
      : getWorkoutIDForDay(activePlanId, new Date().getDay());
    const workout = getWorkoutById(workoutId);
    if (!workout) {
      setActiveWorkout(null);
      return;
    }
    const daysOfWeek =
      listWorkoutDaysByWorkoutIds([workout.id]).get(workout.id) ?? [];
    const exercises = listWorkoutExercisesByWorkout(workout.id);
    setActiveWorkout({ ...workout, daysOfWeek, exercises });
  }, [activePlanId, user?.id]);

  useFocusEffect(load);

  return { workout: activeWorkout, refresh: load };
}
