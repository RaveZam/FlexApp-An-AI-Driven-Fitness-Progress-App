import { enqueueOutbox } from "@/src/features/outbox";
import * as preferencesDao from "@/src/lib/dao/preferences";
import {
  DEFAULT_REST_TIMER_SECONDS,
  MAX_REST_TIMER_SECONDS,
  MIN_REST_TIMER_SECONDS,
  type UserPreferences,
} from "../types";

export function getPreferences(userId: string): UserPreferences | null {
  return preferencesDao.get(userId);
}

export function getRestTimerSeconds(userId: string): number {
  return preferencesDao.get(userId)?.restTimerSeconds ?? DEFAULT_REST_TIMER_SECONDS;
}

export function setActivePlan(userId: string, planId: string | null): void {
  const now = new Date().toISOString();
  preferencesDao.upsertActivePlan(userId, planId, now);
  enqueueOutbox({
    entityType: "user_preferences",
    entityId: userId,
    operation: "update",
    payload: { updatedAt: now },
  });
}

export function setRestTimerSeconds(userId: string, seconds: number): void {
  const clamped = Math.min(
    MAX_REST_TIMER_SECONDS,
    Math.max(MIN_REST_TIMER_SECONDS, Math.round(seconds))
  );
  const now = new Date().toISOString();
  preferencesDao.upsertRestTimerSeconds(userId, clamped, now);
  enqueueOutbox({
    entityType: "user_preferences",
    entityId: userId,
    operation: "update",
    payload: { updatedAt: now },
  });
}

export function upsertPreferencesFromRemote(row: UserPreferences): void {
  preferencesDao.upsertFromRemote(row);
}
