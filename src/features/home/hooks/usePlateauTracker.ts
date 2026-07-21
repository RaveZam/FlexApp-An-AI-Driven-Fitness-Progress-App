import { useAuth } from "@/src/features/auth";
import {
  detectPlateaus,
  type PlateauResult,
} from "@/src/features/home/core/detectPlateaus";
import { toExerciseProgress } from "@/src/features/home/core/toExerciseProgress";
import { listLoggedWorkouts } from "@/src/features/home/services/ProgressiveOverloadDao/progressiveOverloadDao";
import { getTip } from "@/src/features/home/services/plateauSuggestionService";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";

const DETECTION_LIMIT = 12;

export type PlateauWithTip = PlateauResult & { tip: string | null };

function tipKey(p: PlateauResult): string {
  return `${p.name}|${p.weight}|${p.reps}`;
}

export function usePlateauTracker(): { plateaus: PlateauWithTip[] } {
  const { userId } = useAuth();

  const [plateaus, setPlateaus] = useState<PlateauResult[]>([]);

  const load = useCallback(() => {
    if (!userId) {
      setPlateaus([]);
      return;
    }
    const exercises = toExerciseProgress(
      listLoggedWorkouts(userId, DETECTION_LIMIT),
    );
    setPlateaus(detectPlateaus(exercises));
  }, [userId]);

  useFocusEffect(load);

  const [tips, setTips] = useState<Record<string, string | null>>({});

  useEffect(() => {
    setTips({});
  }, [userId]);

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

  const withTips: PlateauWithTip[] = plateaus.map((p) => ({
    ...p,
    tip: tips[tipKey(p)] ?? null,
  }));

  return { plateaus: withTips };
}
