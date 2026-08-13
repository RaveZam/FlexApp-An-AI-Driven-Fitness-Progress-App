import { getDb } from "@/src/lib/db";

export type CatalogRow = {
  id: string;
  name: string;
  muscleGroup: string | null;
  description: string | null;
  isUnilateral: boolean;
};

type Raw = {
  id: string;
  name: string;
  muscle_group: string | null;
  description: string | null;
  is_unilateral: number;
};

const fromRaw = (r: Raw): CatalogRow => ({
  id: r.id,
  name: r.name,
  muscleGroup: r.muscle_group,
  description: r.description,
  isUnilateral: !!r.is_unilateral,
});

export function listCatalogExercises(): CatalogRow[] {
  return getDb()
    .getAllSync<Raw>("SELECT * FROM exercises_catalog ORDER BY name ASC")
    .map(fromRaw);
}

export function upsertManyCatalogExercises(rows: CatalogRow[]): void {
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
