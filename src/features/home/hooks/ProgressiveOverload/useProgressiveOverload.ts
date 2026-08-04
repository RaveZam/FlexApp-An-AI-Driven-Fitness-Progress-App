import { useAuth } from "@/src/features/auth";
import { toExerciseProgress } from "@/src/features/home/core/toExerciseProgress";
import type { ExerciseProgress } from "@/src/features/home/types/progressiveOverload";
import { listRecentTopSetsByUser } from "@/src/lib/dao/exerciseStats";
import { useMemo } from "react";

export const ALL_BODY_PARTS = "All";

export function useProgressiveOverload(bodyFilter: string = ALL_BODY_PARTS) {
  const { user } = useAuth();

  const all = useMemo<ExerciseProgress[]>(
    () => toExerciseProgress(listRecentTopSetsByUser(user?.id ?? null), 7),
    [user],
  );

  const muscleGroups = useMemo(() => {
    const groups = new Set<string>();
    for (const e of all) if (e.muscleGroup) groups.add(e.muscleGroup);
    return [...groups].sort();
  }, [all]);

  // No explicit filter yet? Fall back to the first available group so the
  // initial render isn't empty.
  const selectedGroup = bodyFilter || muscleGroups[0] || ALL_BODY_PARTS;

  const exercises = useMemo(() => {
    if (selectedGroup === ALL_BODY_PARTS) return all;
    return all.filter((e) => e.muscleGroup === selectedGroup);
  }, [all, selectedGroup]);

  return { exercises, muscleGroups, selectedGroup };
}
