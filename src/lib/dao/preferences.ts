import { getWorkoutIDForDay } from "@/src/lib/dao/workouts";
import { getLocalDateKey } from "@/src/lib/date";
import { getDb } from "@/src/lib/db";

export type PreferencesRow = {
  userId: string;
  activePlanId: string | null;
  restTimerSeconds: number;
  updatedAt: string;
};

export function getActivePlanIdForUser(userId: string | null): string | null {
  if (!userId) return null;
  const row = getDb().getFirstSync<{
    active_plan_id: string | null;
  }>("SELECT active_plan_id FROM user_preferences WHERE user_id = ?", [userId]);
  return row?.active_plan_id ?? null;
}

export function getRestTimerSecondsForUser(userId: string | null): number {
  if (!userId) return 120;

  const row = getDb().getFirstSync<{
    rest_timer_seconds: number;
  }>("SELECT rest_timer_seconds FROM user_preferences WHERE user_id = ?", [
    userId,
  ]);
  return row?.rest_timer_seconds ?? 120;
}

export function getPreferencesForUser(userId: string): PreferencesRow | null {
  const row = getDb().getFirstSync<{
    user_id: string;
    active_plan_id: string | null;
    rest_timer_seconds: number;
    updated_at: string;
  }>(
    "SELECT user_id, active_plan_id, rest_timer_seconds, updated_at FROM user_preferences WHERE user_id = ?",
    [userId],
  );
  if (!row) return null;
  return {
    userId: row.user_id,
    activePlanId: row.active_plan_id,
    restTimerSeconds: row.rest_timer_seconds,
    updatedAt: row.updated_at,
  };
}

export function upsertActivePlanIdForUser(
  userId: string,
  planId: string | null,
  now: string,
): void {
  getDb().runSync(
    `INSERT INTO user_preferences (user_id, active_plan_id, updated_at)
     VALUES (?, ?, ?)
     ON CONFLICT(user_id) DO UPDATE SET
       active_plan_id = excluded.active_plan_id,
       updated_at = excluded.updated_at`,
    [userId, planId, now],
  );
}

// Returns the manually-picked workout override for `userId`, but only if it
// was set on `dateKey` — a stale (previous-day) override is treated as unset
// so callers fall back to deriving the workout from the day's schedule.
export function getActiveWorkoutIdForUser(
  userId: string | null,
  dateKey: string,
): string | null {
  if (!userId) return null;
  const row = getDb().getFirstSync<{
    active_workout_id: string | null;
    active_workout_date: string | null;
  }>(
    "SELECT active_workout_id, active_workout_date FROM user_preferences WHERE user_id = ?",
    [userId],
  );
  if (!row || row.active_workout_date !== dateKey) return null;
  return row.active_workout_id;
}

// This is always triggered for creating a session, It will first always query a getworkoutID with a date key, the purpose of this is to return
// a workout that deviates from the current plan, if a workout exist in the dateKey it will return that override for that day to be started, if not
// just gets the workoutidforday that returns the workout on that plan
export function resolveActiveWorkoutId(
  userId: string | null,
  planId: string,
  dateKey: string = getLocalDateKey(),
): string | null {
  const override = getActiveWorkoutIdForUser(userId, dateKey);
  if (override) return override;
  const today = new Date().getDay();
  return getWorkoutIDForDay(planId, today);
}
//This is used when user selects a workout that deviates from their plan, allowing for flexible selection
export function upsertActiveWorkoutForUser(
  userId: string,
  workoutId: string,
  dateKey: string,
  now: string,
): void {
  getDb().runSync(
    `INSERT INTO user_preferences (user_id, active_workout_id, active_workout_date, updated_at)
     VALUES (?, ?, ?, ?)
     ON CONFLICT(user_id) DO UPDATE SET
       active_workout_id = excluded.active_workout_id,
       active_workout_date = excluded.active_workout_date,
       updated_at = excluded.updated_at`,
    [userId, workoutId, dateKey, now],
  );
}

export function upsertRestTimerSecondsForUser(
  userId: string,
  seconds: number,
  now: string,
): void {
  getDb().runSync(
    `INSERT INTO user_preferences (user_id, rest_timer_seconds, updated_at)
     VALUES (?, ?, ?)
     ON CONFLICT(user_id) DO UPDATE SET
       rest_timer_seconds = excluded.rest_timer_seconds,
       updated_at = excluded.updated_at`,
    [userId, seconds, now],
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
    [row.userId, row.activePlanId, row.restTimerSeconds, row.updatedAt],
  );
}
