import { useAuth } from "@/src/features/auth";
import {
  detectPlateaus,
  type PlateauResult,
} from "@/src/features/home/core/detectPlateaus";
import { toExerciseProgress } from "@/src/features/home/core/toExerciseProgress";
import { getTip } from "@/src/features/home/services/plateauSuggestionService";
import { listRecentTopSetsByUser } from "@/src/lib/dao/exerciseStats";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";

// How many of each exercise's own past occurrences to look at for plateau detection.
const DETECTION_LIMIT = 10;

export type PlateauWithTip = PlateauResult & { tip: string | null };

function tipKey(p: PlateauResult): string {
  return `${p.name}|${p.weight}|${p.reps}`;
}

export function usePlateauTracker(): { plateaus: PlateauWithTip[] } {
  const { userId } = useAuth();

  const [plateaus, setPlateaus] = useState<PlateauResult[]>([]);

  //This finds the plateaued workouts
  const load = useCallback(() => {
    if (!userId) {
      setPlateaus([]);
      return;
    }
    const exercises = toExerciseProgress(
      listRecentTopSetsByUser(userId),
      DETECTION_LIMIT,
    );
    setPlateaus(detectPlateaus(exercises));
  }, [userId]);

  useFocusEffect(load);

  const [tips, setTips] = useState<Record<string, string | null>>({});

  //This resets the tips when the user changes
  useEffect(() => {
    setTips({});
  }, [userId]);

  //This fetches the tips for the plateaued workouts, returns cached if there is, if not query for one and set it
  useEffect(() => {
    if (!userId) return;

    for (const p of plateaus) {
      const key = tipKey(p);
      setTips((prev) => (key in prev ? prev : { ...prev, [key]: null }));

      getTip(userId, p).then((tip) => {
        if (tip) setTips((prev) => ({ ...prev, [key]: tip }));
      });
    }
  }, [userId, plateaus]);

  //This adds the tips to the plateaued workouts
  const withTips: PlateauWithTip[] = plateaus.map((p) => ({
    ...p,
    tip: tips[tipKey(p)] ?? null,
  }));

  return { plateaus: withTips };
}
