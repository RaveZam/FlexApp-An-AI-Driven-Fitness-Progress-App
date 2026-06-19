import type { Workout } from "@/src/features/workouts";
import { listWorkoutDaysByWorkoutIds } from "@/src/lib/dao/workoutDays";
import { listWorkoutExercisesByWorkout } from "@/src/lib/dao/workoutExercises";
import { getWorkoutById, getWorkoutIDForDay } from "@/src/lib/dao/workouts";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import useGetActivePlan from "./useGetActivePlan";

export default function useGetActiveWorkout() {
  const activePlanId = useGetActivePlan();
  const [activeWorkout, setActiveWorkout] = useState<Workout | null>(null);

  useFocusEffect(
    useCallback(() => {
      if (!activePlanId) {
        setActiveWorkout(null);
        return;
      }
      const today = new Date().getDay(); // 0=Sun … 6=Sat
      const workout = getWorkoutById(getWorkoutIDForDay(activePlanId, today));
      if (!workout) {
        setActiveWorkout(null);
        return;
      }
      const daysOfWeek =
        listWorkoutDaysByWorkoutIds([workout.id]).get(workout.id) ?? [];
      const exercises = listWorkoutExercisesByWorkout(workout.id);
      setActiveWorkout({ ...workout, daysOfWeek, exercises });
    }, [activePlanId]),
  );

  return activeWorkout;
}
