import { useAuth } from "@/src/features/auth/hooks/useAuth";
import { WorkoutExerciseRow } from "@/src/lib/dao/workoutExercises";
import { useMemo } from "react";
import { getCurrentWorkoutExercises } from "../core/getCurrentWorkouts";

export function useGetCurrentWorkoutExercises() {
  const { userId } = useAuth();
  const today = new Date().getDay();

  return useMemo<WorkoutExerciseRow[]>(() => {
    return userId ? getCurrentWorkoutExercises(userId, today) : [];
  }, [userId, today]);
}