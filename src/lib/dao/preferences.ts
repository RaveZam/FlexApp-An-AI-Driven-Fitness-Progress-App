import { getDb } from "@/src/lib/db";

export type PreferencesRow = {
  userId: string;
  activePlanId: string | null;
  restTimerSeconds: number;
  updatedAt: string;
};

export function getActivePlanIdForUser(userId: string): string | null {
  const row = getDb().getFirstSync<{
    active_plan_id: string | null;
  }>(
    "SELECT active_plan_id FROM user_preferences WHERE user_id = ?",
    [userId]
  );
  return row?.active_plan_id ?? null;
}

export function getPreferencesForUser(userId: string): PreferencesRow | null {
  const row = getDb().getFirstSync<{
    user_id: string;
    active_plan_id: string | null;
    rest_timer_seconds: number;
    updated_at: string;
  }>(
    "SELECT user_id, active_plan_id, rest_timer_seconds, updated_at FROM user_preferences WHERE user_id = ?",
    [userId]
  );
  if (!row) return null;
  return {
    userId: row.user_id,
    activePlanId: row.active_plan_id,
    restTimerSeconds: row.rest_timer_seconds,
    updatedAt: row.updated_at,
  };
}

export function upsertActivePlanIdForUser(userId: string, planId: string | null, now: string): void {
  getDb().runSync(
    `INSERT INTO user_preferences (user_id, active_plan_id, updated_at)
     VALUES (?, ?, ?)
     ON CONFLICT(user_id) DO UPDATE SET
       active_plan_id = excluded.active_plan_id,
       updated_at = excluded.updated_at`,
    [userId, planId, now]
  );
}

export function upsertRestTimerSecondsForUser(
  userId: string,
  seconds: number,
  now: string
): void {
  getDb().runSync(
    `INSERT INTO user_preferences (user_id, rest_timer_seconds, updated_at)
     VALUES (?, ?, ?)
     ON CONFLICT(user_id) DO UPDATE SET
       rest_timer_seconds = excluded.rest_timer_seconds,
       updated_at = excluded.updated_at`,
    [userId, seconds, now]
  );
}

export function upsertPreferencesFromRemote(row: PreferencesRow): void {
  getDb().runSync(
    `INSERT INTO user_preferences (user_id, active_plan_id, rest_timer_seconds, updated_at)
     VALUES (?, ?, ?, ?)
     ON CONFLICT(user_id) DO UPDATE SET
       active_plan_id = excluded.active_plan_id,
       rest_timer_seconds = excluded.rest_timer_seconds,
       updated_at = excluded.updated_at`,
    [row.userId, row.activePlanId, row.restTimerSeconds, row.updatedAt]
  );
}
