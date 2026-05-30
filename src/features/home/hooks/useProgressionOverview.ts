import { useAuth } from "@/src/features/auth/hooks/useAuth";
import { useActivePlan } from "@/src/features/workouts/context/ActivePlanContext";
import { listPlans } from "@/src/features/workouts/services/workoutLocalService";
import { fetchExerciseCatalog } from "@/src/features/workouts/services/workoutSupabaseService";
import type { CatalogExercise } from "@/src/features/workouts/types";
import { listRecentTopSets } from "@/src/lib/dao/exerciseStats";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";

export type BodyPart = "Chest" | "Back" | "Shoulders" | "Biceps" | "Triceps" | "Legs" | "Other";

export type ExerciseProgress = {
  name: string;
  bodyPart: BodyPart;
  currentWeight: number;
  currentReps: number;
  unit: "lbs" ;
  deltaWeight: number;
  deltaReps: number;
  history: number[];
  repsHistory: number[];
};

const SESSION_WINDOW = 6;

function mapMuscleGroup(group: string | null | undefined): BodyPart {
  if (!group) return "Other";
  const g = group.toLowerCase();
  if (g.includes("chest") || g.includes("pec")) return "Chest";
  if (g.includes("back") || g.includes("lat") || g.includes("trap") || g.includes("rhomboid"))
    return "Back";
  if (g.includes("shoulder") || g.includes("delt")) return "Shoulders";
  if (g.includes("bicep")) return "Biceps";
  if (g.includes("tricep")) return "Triceps";
  if (
    g.includes("leg") ||
    g.includes("quad") ||
    g.includes("hamstring") ||
    g.includes("glute") ||
    g.includes("calf") ||
    g.includes("calves")
  )
    return "Legs";
  return "Other";
}

export function useProgressionOverview(): {
  exercises: ExerciseProgress[];
  hasActivePlan: boolean;
  loading: boolean;
} {
  const { user } = useAuth();
  const { activePlanId, loading: planLoading } = useActivePlan();
  const userId = user?.id ?? null;

  const [catalog, setCatalog] = useState<CatalogExercise[] | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    fetchExerciseCatalog()
      .then((rows) => {
        if (!cancelled) setCatalog(rows);
      })
      .catch(() => {
        if (!cancelled) setCatalog([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      setRefreshKey((k) => k + 1);
    }, [])
  );

  const exercises = useMemo<ExerciseProgress[]>(() => {
    if (!userId || !activePlanId) return [];

    const plans = listPlans(userId);
    const plan = plans.find((p) => p.id === activePlanId);
    if (!plan) return [];

    const muscleByName = new Map<string, string | null>();
    const muscleById = new Map<string, string | null>();
    for (const c of catalog ?? []) {
      muscleByName.set(c.name.toLowerCase(), c.muscleGroup);
      muscleById.set(c.id, c.muscleGroup);
    }

    const seen = new Map<string, { name: string; muscleGroup: string | null }>();
    for (const workout of plan.workouts) {
      for (const ex of workout.exercises) {
        const key = ex.name.toLowerCase();
        if (seen.has(key)) continue;
        const muscle =
          (ex.catalogExerciseId && muscleById.get(ex.catalogExerciseId)) ??
          muscleByName.get(key) ??
          null;
        seen.set(key, { name: ex.name, muscleGroup: muscle });
      }
    }

    const results: ExerciseProgress[] = [];
    for (const { name, muscleGroup } of seen.values()) {
      const topSets = listRecentTopSets(userId, name, SESSION_WINDOW);
      if (topSets.length === 0) {
        results.push({
          name,
          bodyPart: mapMuscleGroup(muscleGroup),
          currentWeight: 0,
          currentReps: 0,
          unit: "lbs",
          deltaWeight: 0,
          deltaReps: 0,
          history: [],
          repsHistory: [],
        });
        continue;
      }

      const history = topSets.map((s) => s.weight);
      const repsHistory = topSets.map((s) => s.actualReps ?? 0);
      const lastWeight = history[history.length - 1];
      const firstWeight = history[0];
      const lastReps = repsHistory[repsHistory.length - 1];
      const firstReps = repsHistory[0];

      results.push({
        name,
        bodyPart: mapMuscleGroup(muscleGroup),
        currentWeight: lastWeight,
        currentReps: lastReps,
        unit: "lbs",
        deltaWeight: lastWeight - firstWeight,
        deltaReps: lastReps - firstReps,
        history,
        repsHistory,
      });
    }

    return results;
  }, [userId, activePlanId, catalog, refreshKey]);

  return {
    exercises,
    hasActivePlan: !!activePlanId,
    loading: planLoading || catalog === null,
  };
}
