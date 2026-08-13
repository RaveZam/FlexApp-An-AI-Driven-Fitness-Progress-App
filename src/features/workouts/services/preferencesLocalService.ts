import { enqueueOutbox } from "@/src/features/outbox";
import * as preferencesDao from "@/src/lib/dao/preferences";
import { getDb } from "@/src/lib/db";
import {
  DEFAULT_REST_TIMER_SECONDS,
  MAX_REST_TIMER_SECONDS,
  MIN_REST_TIMER_SECONDS,
  type UserPreferences,
} from "../types";

export function getPreferences(userId: string): UserPreferences | null {
  return preferencesDao.getPreferencesForUser(userId);
}

export function getRestTimerSeconds(userId: string): number {
  return (
    preferencesDao.getPreferencesForUser(userId)?.restTimerSeconds ??
    DEFAULT_REST_TIMER_SECONDS
  );
}

function enqueuePreferencesUpdate(userId: string): void {
  const prefs = preferencesDao.getPreferencesForUser(userId);
  if (!prefs) return;
  enqueueOutbox({
    entityType: "user_preferences",
    entityId: userId,
    operation: "update",
    payload: {
      activePlanId: prefs.activePlanId,
      restTimerSeconds: prefs.restTimerSeconds,
      updatedAt: prefs.updatedAt,
    },
  });
}

export function setActivePlan(userId: string, planId: string | null): void {
  const db = getDb();
  const now = new Date().toISOString();
  db.withTransactionSync(() => {
    preferencesDao.upsertActivePlanIdForUser(userId, planId, now);
    enqueuePreferencesUpdate(userId);
  });
}

export function setRestTimerSeconds(userId: string, seconds: number): void {
  const clamped = Math.min(
    MAX_REST_TIMER_SECONDS,
    Math.max(MIN_REST_TIMER_SECONDS, Math.round(seconds)),
  );
  const db = getDb();
  const now = new Date().toISOString();
  db.withTransactionSync(() => {
    preferencesDao.upsertRestTimerSecondsForUser(userId, clamped, now);
    enqueuePreferencesUpdate(userId);
  });
}

export function upsertPreferencesFromRemote(row: UserPreferences): void {
  preferencesDao.upsertPreferencesFromRemote(row);
}
