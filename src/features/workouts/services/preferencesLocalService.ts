import { getDb } from "@/src/lib/db";
import type { UserPreferences } from "../types";

export function getPreferences(userId: string): UserPreferences | null {
  const db = getDb();
  const row = db.getFirstSync<{ user_id: string; active_plan_id: string | null; updated_at: string }>(
    "SELECT user_id, active_plan_id, updated_at FROM user_preferences WHERE user_id = ?",
    [userId]
  );
  if (!row) return null;
  return { userId: row.user_id, activePlanId: row.active_plan_id, updatedAt: row.updated_at };
}

export function setActivePlan(userId: string, planId: string | null): void {
  const db = getDb();
  const now = new Date().toISOString();
  db.runSync(
    `INSERT INTO user_preferences (user_id, active_plan_id, updated_at)
     VALUES (?, ?, ?)
     ON CONFLICT(user_id) DO UPDATE SET active_plan_id = excluded.active_plan_id, updated_at = excluded.updated_at`,
    [userId, planId, now]
  );

  const outboxId = `pref-${userId}-${Date.now()}`;
  db.runSync(
    "INSERT INTO outbox (id, entity_type, entity_id, operation, payload, created_at) VALUES (?, ?, ?, ?, ?, ?)",
    [
      outboxId,
      "user_preferences",
      userId,
      "update",
      JSON.stringify({ activePlanId: planId, updatedAt: now }),
      now,
    ]
  );
}
