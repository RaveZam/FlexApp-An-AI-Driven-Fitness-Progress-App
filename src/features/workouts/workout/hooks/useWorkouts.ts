import { useAuth } from "@/src/features/auth";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { fetchWorkouts } from "../../services/workoutSupabaseService";
import { listWorkouts, upsertWorkouts } from "../../services/workoutLocalService";
import type { Workout } from "../../types";

export function useWorkouts() {
  const { session } = useAuth();
  const userId = session?.user.id ?? null;

  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!userId) {
      setWorkouts([]);
      setLoading(false);
      return;
    }

    // Read local first for instant render
    const local = listWorkouts(userId);
    setWorkouts(local);
    setLoading(false);

    // Background sync from Supabase
    try {
      const remote = await fetchWorkouts(userId);
      upsertWorkouts(remote);
      setWorkouts(listWorkouts(userId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sync failed");
    }
  }, [userId]);

  const refreshLocal = useCallback(() => {
    if (!userId) return;
    setWorkouts(listWorkouts(userId));
  }, [userId]);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      load();
    }, [load])
  );

  return { workouts, loading, error, refresh: load, refreshLocal };
}
