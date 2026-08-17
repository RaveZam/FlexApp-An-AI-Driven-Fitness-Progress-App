import { toExerciseProgress } from "@/src/features/home/core/toExerciseProgress";
import type { ExerciseProgress } from "@/src/features/home/types/progressiveOverload";
import { getCurrentUserId } from "@/src/lib/current-user";
import { listRecentTopSetsByUser } from "@/src/lib/dao/exerciseStats";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useMemo, useState } from "react";

//What body parts to display
export const ALL_BODY_PARTS = "All";

// Last N sessions per exercise shown on the chart.
const SESSION_WINDOW = 7;

export function useProgressiveOverload(bodyFilter: string = ALL_BODY_PARTS) {
  const userId = getCurrentUserId();

  const [userExerciseProgress, setUserExerciseProgress] = useState<
    ExerciseProgress[]
  >([]);

  const load = useCallback(() => {
    if (!userId) {
      setUserExerciseProgress([]);
      return;
    }
    setUserExerciseProgress(
      toExerciseProgress(listRecentTopSetsByUser(userId, SESSION_WINDOW)),
    );
  }, [userId]);

  useFocusEffect(load);

  const muscleGroups = useMemo(() => {
    const groups = new Set<string>();
    for (const e of userExerciseProgress)
      if (e.muscleGroup) groups.add(e.muscleGroup);
    return [...groups].sort();
  }, [userExerciseProgress]);

  // No explicit filter yet? Fall back to the first available group so the
  // initial render isn't empty.
  const selectedGroup = bodyFilter || muscleGroups[0] || ALL_BODY_PARTS;

  const exercises = useMemo(() => {
    if (selectedGroup === ALL_BODY_PARTS) return userExerciseProgress;
    return userExerciseProgress.filter((e) => e.muscleGroup === selectedGroup);
  }, [userExerciseProgress, selectedGroup]);

  return { exercises, muscleGroups, selectedGroup };
}
