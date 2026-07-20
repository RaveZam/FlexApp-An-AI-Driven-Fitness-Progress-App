import { useAuth } from "@/src/features/auth";
import { detectPlateaus, type PlateauResult } from "@/src/features/home/core/detectPlateaus";
import { toExerciseProgress } from "@/src/features/home/core/toExerciseProgress";
import { listLoggedWorkouts } from "@/src/features/home/services/ProgressiveOverloadDao/progressiveOverloadDao";
import {
  getCachedTip,
  saveCachedTip,
} from "@/src/features/home/services/plateauTipsLocalService";
import { supabase } from "@/src/lib/supabase";
import { useEffect, useMemo, useState } from "react";

const DETECTION_LIMIT = 12;

export type PlateauWithTip = PlateauResult & { tip: string | null };

function tipKey(p: PlateauResult): string {
  return `${p.name}|${p.weight}|${p.reps}`;
}

export function usePlateauTracker(): { plateaus: PlateauWithTip[] } {
  const { userId } = useAuth();

  const plateaus = useMemo<PlateauResult[]>(() => {
    if (!userId) return [];
    const exercises = toExerciseProgress(listLoggedWorkouts(userId, DETECTION_LIMIT));
    return detectPlateaus(exercises);
  }, [userId]);

  const [tips, setTips] = useState<Record<string, string | null>>({});

  useEffect(() => {
    if (!userId) return;

    for (const p of plateaus) {
      const key = tipKey(p);
      const cached = getCachedTip(userId, p.name, p.weight, p.reps);

      if (cached) {
        setTips((prev) => (prev[key] === cached ? prev : { ...prev, [key]: cached }));
        continue;
      }

      setTips((prev) => (key in prev ? prev : { ...prev, [key]: null }));

      supabase.functions
        .invoke<{ tip: string }>("plateau-suggestion", {
          body: {
            exerciseName: p.name,
            muscleGroup: p.muscleGroup,
            weight: p.weight,
            reps: p.reps,
            sessionsStuck: p.sessionsStuck,
          },
        })
        .then(({ data, error }) => {
          if (error || !data?.tip) return;
          saveCachedTip(userId, p.name, p.weight, p.reps, data.tip);
          setTips((prev) => ({ ...prev, [key]: data.tip }));
        })
        .catch(() => {});
    }
    // Runs whenever the detected plateau set changes (i.e. userId changes,
    // since `plateaus` is memoized on userId) — not on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, plateaus]);

  const withTips: PlateauWithTip[] = plateaus.map((p) => ({
    ...p,
    tip: tips[tipKey(p)] ?? null,
  }));

  return { plateaus: withTips };
}
