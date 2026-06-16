import { getDb } from "@/src/lib/db";

export type SessionSetRow = {
  id: string;
  sessionExerciseId: string;
  setIndex: number;
  targetReps: number;
  actualReps: number | null;
  actualRepsLeft: number | null;
  actualRepsRight: number | null;
  weight: number | null;
  completed: boolean;
  completedAt: string | null;
};

type Raw = {
  id: string;
  session_exercise_id: string;
  set_index: number;
  target_reps: number;
  actual_reps: number | null;
  actual_reps_left: number | null;
  actual_reps_right: number | null;
  weight: number | null;
  completed: number;
  completed_at: string | null;
};

const fromRaw = (r: Raw): SessionSetRow => ({
  id: r.id,
  sessionExerciseId: r.session_exercise_id,
  setIndex: r.set_index,
  targetReps: r.target_reps,
  actualReps: r.actual_reps,
  actualRepsLeft: r.actual_reps_left,
  actualRepsRight: r.actual_reps_right,
  weight: r.weight,
  completed: r.completed === 1,
  completedAt: r.completed_at,
});

export function listSessionSetsByExercise(sessionExerciseId: string): SessionSetRow[] {
  return getDb()
    .getAllSync<Raw>(
      "SELECT * FROM session_sets WHERE session_exercise_id = ? ORDER BY set_index ASC",
      [sessionExerciseId]
    )
    .map(fromRaw);
}

export function getSessionSetById(setId: string): SessionSetRow | null {
  const row = getDb().getFirstSync<Raw>("SELECT * FROM session_sets WHERE id = ?", [setId]);
  return row ? fromRaw(row) : null;
}

export function insertSessionSet(params: {
  id: string;
  sessionExerciseId: string;
  setIndex: number;
  targetReps: number;
}): void {
  getDb().runSync(
    `INSERT INTO session_sets
     (id, session_exercise_id, set_index, target_reps, actual_reps, weight, completed, completed_at)
     VALUES (?, ?, ?, ?, NULL, NULL, 0, NULL)`,
    [params.id, params.sessionExerciseId, params.setIndex, params.targetReps]
  );
}

export function updateSessionSet(params: {
  id: string;
  actualReps: number | null;
  actualRepsLeft: number | null;
  actualRepsRight: number | null;
  weight: number | null;
  completed: boolean;
  completedAt: string | null;
}): void {
  getDb().runSync(
    "UPDATE session_sets SET actual_reps = ?, actual_reps_left = ?, actual_reps_right = ?, weight = ?, completed = ?, completed_at = ? WHERE id = ?",
    [
      params.actualReps,
      params.actualRepsLeft,
      params.actualRepsRight,
      params.weight,
      params.completed ? 1 : 0,
      params.completedAt,
      params.id,
    ]
  );
}

export function deleteSessionSetsBySession(sessionId: string): void {
  getDb().runSync(
    "DELETE FROM session_sets WHERE session_exercise_id IN (SELECT id FROM session_exercises WHERE session_id = ?)",
    [sessionId]
  );
}
