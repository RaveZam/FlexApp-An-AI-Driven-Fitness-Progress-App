import { supabase } from "@/src/lib/supabase";
import { DEFAULT_REST_TIMER_SECONDS, type UserPreferences } from "../types";
import {
  getPreferences,
  setRestTimerSeconds,
  upsertPreferencesFromRemote,
} from "./preferencesLocalService";

export async function syncPreferencesFromRemote(userId: string): Promise<void> {
  const { data, error } = await supabase
    .from("user_preferences")
    .select("user_id, active_plan_id, rest_timer_seconds, updated_at")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.error("[preferences] sync-down failed:", error);
    return;
  }

  if (data) {
    const remote: UserPreferences = {
      userId: data.user_id,
      activePlanId: data.active_plan_id,
      restTimerSeconds: data.rest_timer_seconds ?? DEFAULT_REST_TIMER_SECONDS,
      updatedAt: data.updated_at,
    };
    upsertPreferencesFromRemote(remote);
    return;
  }

  // No remote row — seed local + enqueue an upsert so Supabase gets the default.
  if (!getPreferences(userId)) {
    setRestTimerSeconds(userId, DEFAULT_REST_TIMER_SECONDS);
  }
}
