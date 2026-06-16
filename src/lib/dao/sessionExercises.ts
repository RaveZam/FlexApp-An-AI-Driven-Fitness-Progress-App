import { getDb } from "@/src/lib/db";

export type SessionExerciseRow = {
  id: string;
  sessionId: string;
  sourceExerciseId: string | null;
  catalogExerciseId: string | null;
  name: string;
  targetSets: number;
  targetReps: number;
  position: number;
  isUnilateral: boolean;
};

type Raw = {
  id: string;
  session_id: string;
  source_exercise_id: string | null;
  catalog_exercise_id: string | null;
  name: string;
  target_sets: number;
  target_reps: number;
  position: number;
  is_unilateral: number;
};

const fromRaw = (r: Raw): SessionExerciseRow => ({
  id: r.id,
  sessionId: r.session_id,
  sourceExerciseId: r.source_exercise_id,
  catalogExerciseId: r.catalog_exercise_id,
  name: r.name,
  targetSets: r.target_sets,
  targetReps: r.target_reps,
  position: r.position,
  isUnilateral: r.is_unilateral === 1,
});

export function listSessionExercisesBySession(sessionId: string): SessionExerciseRow[] {
  return getDb()
    .getAllSync<Raw>(
      "SELECT * FROM session_exercises WHERE session_id = ? ORDER BY position ASC",
      [sessionId]
    )
    .map(fromRaw);
}

export function insertSessionExercise(ex: SessionExerciseRow): void {
  getDb().runSync(
    `INSERT INTO session_exercises
     (id, session_id, source_exercise_id, catalog_exercise_id, name, target_sets, target_reps, position, is_unilateral)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      ex.id,
      ex.sessionId,
      ex.sourceExerciseId,
      ex.catalogExerciseId,
      ex.name,
      ex.targetSets,
      ex.targetReps,
      ex.position,
      ex.isUnilateral ? 1 : 0,
    ]
  );
}

export function deleteSessionExercisesBySession(sessionId: string): void {
  getDb().runSync("DELETE FROM session_exercises WHERE session_id = ?", [sessionId]);
}
