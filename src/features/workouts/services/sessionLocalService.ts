import { getDb } from "@/src/lib/db";
import { generateUUID } from "@/src/lib/uuid";
import type { SessionExercise, SessionSet, Workout, WorkoutSession } from "../types";

export function hydrateSession(
  sessionRow: {
    id: string; user_id: string; workout_id: string; plan_id: string | null;
    name: string; status: string; started_at: string; completed_at: string | null;
    created_at: string; updated_at: string;
  }
): WorkoutSession {
  const db = getDb();
  const exerciseRows = db.getAllSync<{
    id: string; session_id: string; source_exercise_id: string | null;
    catalog_exercise_id: string | null; name: string; target_sets: number;
    target_reps: number; position: number;
  }>(
    "SELECT * FROM session_exercises WHERE session_id = ? ORDER BY position ASC",
    [sessionRow.id]
  );

  const exercises: SessionExercise[] = exerciseRows.map((ex) => {
    const setRows = db.getAllSync<{
      id: string; session_exercise_id: string; set_index: number; target_reps: number;
      actual_reps: number | null; weight: number | null; completed: number; completed_at: string | null;
    }>(
      "SELECT * FROM session_sets WHERE session_exercise_id = ? ORDER BY set_index ASC",
      [ex.id]
    );
    const sets: SessionSet[] = setRows.map((s) => ({
      id: s.id,
      sessionExerciseId: s.session_exercise_id,
      setIndex: s.set_index,
      targetReps: s.target_reps,
      actualReps: s.actual_reps,
      weight: s.weight,
      completed: s.completed === 1,
      completedAt: s.completed_at,
    }));
    return {
      id: ex.id,
      sessionId: ex.session_id,
      sourceExerciseId: ex.source_exercise_id,
      catalogExerciseId: ex.catalog_exercise_id,
      name: ex.name,
      targetSets: ex.target_sets,
      targetReps: ex.target_reps,
      position: ex.position,
      sets,
    };
  });

  return {
    id: sessionRow.id,
    userId: sessionRow.user_id,
    workoutId: sessionRow.workout_id,
    planId: sessionRow.plan_id,
    name: sessionRow.name,
    status: sessionRow.status as WorkoutSession["status"],
    startedAt: sessionRow.started_at,
    completedAt: sessionRow.completed_at,
    createdAt: sessionRow.created_at,
    updatedAt: sessionRow.updated_at,
    exercises,
  };
}

export function getActiveSession(userId: string): WorkoutSession | null {
  const db = getDb();
  const row = db.getFirstSync<{
    id: string; user_id: string; workout_id: string; plan_id: string | null;
    name: string; status: string; started_at: string; completed_at: string | null;
    created_at: string; updated_at: string;
  }>(
    "SELECT * FROM workout_sessions WHERE user_id = ? AND status = 'in_progress' ORDER BY started_at DESC LIMIT 1",
    [userId]
  );
  if (!row) return null;
  return hydrateSession(row);
}

export function getSessionById(sessionId: string): WorkoutSession | null {
  const db = getDb();
  const row = db.getFirstSync<{
    id: string; user_id: string; workout_id: string; plan_id: string | null;
    name: string; status: string; started_at: string; completed_at: string | null;
    created_at: string; updated_at: string;
  }>(
    "SELECT * FROM workout_sessions WHERE id = ?",
    [sessionId]
  );
  if (!row) return null;
  return hydrateSession(row);
}

export function createSessionFromWorkout(userId: string, workout: Workout): WorkoutSession {
  const db = getDb();
  const now = new Date().toISOString();
  const sessionId = generateUUID();

  db.withTransactionSync(() => {
    db.runSync(
      `INSERT INTO workout_sessions (id, user_id, workout_id, plan_id, name, status, started_at, completed_at, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, 'in_progress', ?, NULL, ?, ?)`,
      [sessionId, userId, workout.id, workout.planId ?? null, workout.name, now, now, now]
    );

    const sortedExercises = [...workout.exercises].sort((a, b) => a.position - b.position);
    for (const ex of sortedExercises) {
      const sessionExerciseId = generateUUID();
      db.runSync(
        `INSERT INTO session_exercises (id, session_id, source_exercise_id, catalog_exercise_id, name, target_sets, target_reps, position)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [sessionExerciseId, sessionId, ex.id, ex.catalogExerciseId ?? null, ex.name, ex.targetSets, ex.targetReps, ex.position]
      );
      for (let i = 0; i < ex.targetSets; i++) {
        db.runSync(
          `INSERT INTO session_sets (id, session_exercise_id, set_index, target_reps, actual_reps, weight, completed, completed_at)
           VALUES (?, ?, ?, ?, NULL, NULL, 0, NULL)`,
          [generateUUID(), sessionExerciseId, i, ex.targetReps]
        );
      }
    }

    const outboxId = generateUUID();
    db.runSync(
      "INSERT INTO outbox (id, entity_type, entity_id, operation, payload, created_at) VALUES (?, ?, ?, ?, ?, ?)",
      [
        outboxId,
        "workout_session",
        sessionId,
        "create",
        JSON.stringify({ sessionId, userId, workoutId: workout.id, planId: workout.planId ?? null, name: workout.name, startedAt: now }),
        now,
      ]
    );
  });

  return getSessionById(sessionId)!;
}

export function completeSession(sessionId: string): void {
  const db = getDb();
  const now = new Date().toISOString();
  db.runSync(
    "UPDATE workout_sessions SET status = 'completed', completed_at = ?, updated_at = ? WHERE id = ?",
    [now, now, sessionId]
  );
  db.runSync(
    "INSERT INTO outbox (id, entity_type, entity_id, operation, payload, created_at) VALUES (?, ?, ?, ?, ?, ?)",
    [generateUUID(), "workout_session", sessionId, "update", JSON.stringify({ status: "completed", completedAt: now }), now]
  );
}

export function cancelSession(sessionId: string): void {
  const db = getDb();
  const now = new Date().toISOString();
  db.runSync(
    "UPDATE workout_sessions SET status = 'cancelled', completed_at = ?, updated_at = ? WHERE id = ?",
    [now, now, sessionId]
  );
  db.runSync(
    "INSERT INTO outbox (id, entity_type, entity_id, operation, payload, created_at) VALUES (?, ?, ?, ?, ?, ?)",
    [generateUUID(), "workout_session", sessionId, "update", JSON.stringify({ status: "cancelled", completedAt: now }), now]
  );
}

export function deleteSession(sessionId: string): void {
  const db = getDb();
  const now = new Date().toISOString();
  db.withTransactionSync(() => {
    db.runSync(
      "DELETE FROM session_sets WHERE session_exercise_id IN (SELECT id FROM session_exercises WHERE session_id = ?)",
      [sessionId]
    );
    db.runSync("DELETE FROM session_exercises WHERE session_id = ?", [sessionId]);
    db.runSync("DELETE FROM workout_sessions WHERE id = ?", [sessionId]);
    db.runSync(
      "INSERT INTO outbox (id, entity_type, entity_id, operation, payload, created_at) VALUES (?, ?, ?, ?, ?, ?)",
      [generateUUID(), "workout_session", sessionId, "delete", "{}", now]
    );
  });
}

export function deleteAllSessionsForUser(userId: string): void {
  const db = getDb();
  const now = new Date().toISOString();
  const sessions = db.getAllSync<{ id: string }>(
    "SELECT id FROM workout_sessions WHERE user_id = ?",
    [userId]
  );
  db.withTransactionSync(() => {
    for (const session of sessions) {
      db.runSync(
        "DELETE FROM session_sets WHERE session_exercise_id IN (SELECT id FROM session_exercises WHERE session_id = ?)",
        [session.id]
      );
      db.runSync("DELETE FROM session_exercises WHERE session_id = ?", [session.id]);
      db.runSync("DELETE FROM workout_sessions WHERE id = ?", [session.id]);
      db.runSync(
        "INSERT INTO outbox (id, entity_type, entity_id, operation, payload, created_at) VALUES (?, ?, ?, ?, ?, ?)",
        [generateUUID(), "workout_session", session.id, "delete", "{}", now]
      );
    }
  });
}

export function updateSet(
  setId: string,
  patch: { actualReps?: number; weight?: number; completed?: boolean }
): void {
  const db = getDb();
  const now = new Date().toISOString();
  const current = db.getFirstSync<{ actual_reps: number | null; weight: number | null; completed: number }>(
    "SELECT actual_reps, weight, completed FROM session_sets WHERE id = ?",
    [setId]
  );
  if (!current) return;
  const actualReps = patch.actualReps !== undefined ? patch.actualReps : current.actual_reps;
  const weight = patch.weight !== undefined ? patch.weight : current.weight;
  const completed = patch.completed !== undefined ? patch.completed : current.completed === 1;
  const completedAt = completed ? now : null;
  db.runSync(
    "UPDATE session_sets SET actual_reps = ?, weight = ?, completed = ?, completed_at = ? WHERE id = ?",
    [actualReps, weight, completed ? 1 : 0, completedAt, setId]
  );
  db.runSync(
    "INSERT INTO outbox (id, entity_type, entity_id, operation, payload, created_at) VALUES (?, ?, ?, ?, ?, ?)",
    [generateUUID(), "session_set", setId, "update", JSON.stringify({ actualReps, weight, completed, completedAt }), now]
  );
}
