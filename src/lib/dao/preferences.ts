import { getDb } from "@/src/lib/db";

export type PreferencesRow = {
  userId: string;
  activePlanId: string | null;
  updatedAt: string;
};

export function get(userId: string): PreferencesRow | null {
  const row = getDb().getFirstSync<{
    user_id: string;
    active_plan_id: string | null;
    updated_at: string;
  }>(
    "SELECT user_id, active_plan_id, updated_at FROM user_preferences WHERE user_id = ?",
    [userId]
  );
  if (!row) return null;
  return {
    userId: row.user_id,
    activePlanId: row.active_plan_id,
    updatedAt: row.updated_at,
  };
}

export function upsertActivePlan(userId: string, planId: string | null, now: string): void {
  getDb().runSync(
    `INSERT INTO user_preferences (user_id, active_plan_id, updated_at)
     VALUES (?, ?, ?)
     ON CONFLICT(user_id) DO UPDATE SET
       active_plan_id = excluded.active_plan_id,
       updated_at = excluded.updated_at`,
    [userId, planId, now]
  );
}
