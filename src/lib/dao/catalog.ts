import { getDb } from "@/src/lib/db";

export type CatalogRow = {
  id: string;
  name: string;
  muscleGroup: string | null;
  description: string | null;
  isUnilateral: boolean;
};

export function upsertMany(rows: CatalogRow[]): void {
  const db = getDb();
  db.withTransactionSync(() => {
    for (const r of rows) {
      db.runSync(
        `INSERT INTO exercises_catalog (id, name, muscle_group, description, is_unilateral)
         VALUES (?, ?, ?, ?, ?)
         ON CONFLICT(id) DO UPDATE SET
           name = excluded.name,
           muscle_group = excluded.muscle_group,
           description = excluded.description,
           is_unilateral = excluded.is_unilateral`,
        [r.id, r.name, r.muscleGroup, r.description, r.isUnilateral ? 1 : 0]
      );
    }
  });
}
