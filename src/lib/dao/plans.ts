import { getDb } from "@/src/lib/db";

export type PlanRow = {
  id: string;
  userId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

type Raw = {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
  updated_at: string;
};

const fromRaw = (r: Raw): PlanRow => ({
  id: r.id,
  userId: r.user_id,
  name: r.name,
  createdAt: r.created_at,
  updatedAt: r.updated_at,
});

export function listPlansByUser(userId: string): PlanRow[] {
  return getDb()
    .getAllSync<Raw>(
      "SELECT * FROM user_workout_plans WHERE user_id = ? ORDER BY created_at DESC",
      [userId]
    )
    .map(fromRaw);
}

export function insertPlan(plan: PlanRow): void {
  getDb().runSync(
    "INSERT INTO user_workout_plans (id, user_id, name, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
    [plan.id, plan.userId, plan.name, plan.createdAt, plan.updatedAt]
  );
}

export function upsertPlan(plan: PlanRow): void {
  getDb().runSync(
    `INSERT INTO user_workout_plans (id, user_id, name, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
       name = excluded.name,
       updated_at = excluded.updated_at
     WHERE excluded.updated_at >= user_workout_plans.updated_at`,
    [plan.id, plan.userId, plan.name, plan.createdAt, plan.updatedAt]
  );
}
