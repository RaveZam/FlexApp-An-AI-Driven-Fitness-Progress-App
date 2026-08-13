import { getCurrentUserId } from "@/src/lib/current-user";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { listWorkouts } from "../../services/workoutLocalService";
import type { Workout } from "../../types";

export function useWorkouts() {
  const userId = getCurrentUserId();

  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setWorkouts(userId ? listWorkouts(userId) : []);
    setLoading(false);
  }, [userId]);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      load();
    }, [load])
  );

  return { workouts, loading, refresh: load, refreshLocal: load };
}
