import type { PlateauResult } from "@/src/features/home/core/detectPlateaus";
import {
  getTipDB,
  saveTipDB,
} from "@/src/features/home/services/plateauTipsLocalService";
import { supabase } from "@/src/lib/supabase";

export async function getTip(
  userId: string,
  p: PlateauResult,
): Promise<string | null> {
  const cached = getTipDB(userId, p.name, p.weight, p.reps);
  if (cached) return cached;

  const { data, error } = await supabase.functions.invoke<{ tip: string }>(
    "plateau-suggestion",
    {
      body: {
        exerciseName: p.name,
        muscleGroup: p.muscleGroup,
        weight: p.weight,
        reps: p.reps,
        sessionsStuck: p.sessionsStuck,
      },
    },
  );

  if (error || !data?.tip) {
    console.warn(`Failed to fetch plateau tip for ${p.name}:`, error);
    return null;
  }

  saveTipDB(userId, p.name, p.weight, p.reps, data.tip);
  return data.tip;
}
