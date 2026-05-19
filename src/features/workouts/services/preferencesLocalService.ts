import { enqueueOutbox } from "@/src/features/outbox";
import * as preferencesDao from "@/src/lib/dao/preferences";
import type { UserPreferences } from "../types";

export function getPreferences(userId: string): UserPreferences | null {
  return preferencesDao.get(userId);
}

export function setActivePlan(userId: string, planId: string | null): void {
  const now = new Date().toISOString();
  preferencesDao.upsertActivePlan(userId, planId, now);
  enqueueOutbox({
    entityType: "user_preferences",
    entityId: userId,
    operation: "update",
    payload: { activePlanId: planId, updatedAt: now },
  });
}
