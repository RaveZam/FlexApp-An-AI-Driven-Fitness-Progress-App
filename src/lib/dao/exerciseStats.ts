import { getDb } from "@/src/lib/db";

export type ExerciseBestRow = {
  weight: number;
  actualReps: number | null;
  completedAt: string | null;
  startedAt: string;
};

export type ExerciseTopSetRow = {
  sessionId: string;
  startedAt: string;
  weight: number;
  actualReps: number | null;
};

export function getBestRecordByCatalogId(
  userId: string,
  catalogExerciseId: string,
): ExerciseBestRow | null {
  const row = getDb().getFirstSync<{
    weight: number;
    actual_reps: number | null;
    completed_at: string | null;
    started_at: string;
  }>(
    `SELECT ss.weight,
            COALESCE(ss.actual_reps, max(ss.actual_reps_left, ss.actual_reps_right)) AS actual_reps,
            ss.completed_at, ws.started_at
     FROM session_sets ss
     JOIN session_exercises se ON ss.session_exercise_id = se.id
     JOIN workout_sessions ws ON se.session_id = ws.id
     WHERE ws.user_id = ?
       AND se.catalog_exercise_id = ?
       AND ss.completed = 1
       AND ss.weight IS NOT NULL
       AND ws.status != 'cancelled'
     ORDER BY ss.weight DESC, actual_reps DESC
     LIMIT 1`,
    [userId, catalogExerciseId],
  );
  if (!row) return null;
  return {
    weight: row.weight,
    actualReps: row.actual_reps,
    completedAt: row.completed_at,
    startedAt: row.started_at,
  };
}

export function getExerciseBestRecord(
  userId: string,
  exerciseName: string,
): ExerciseBestRow | null {
  const row = getDb().getFirstSync<{
    weight: number;
    actual_reps: number | null;
    completed_at: string | null;
    started_at: string;
  }>(
    `SELECT ss.weight,
            COALESCE(ss.actual_reps, max(ss.actual_reps_left, ss.actual_reps_right)) AS actual_reps,
            ss.completed_at, ws.started_at
     FROM session_sets ss
     JOIN session_exercises se ON ss.session_exercise_id = se.id
     JOIN workout_sessions ws ON se.session_id = ws.id
     WHERE ws.user_id = ?
       AND se.name = ?
       AND ss.completed = 1
       AND ss.weight IS NOT NULL
       AND ws.status != 'cancelled'
     ORDER BY ss.weight DESC, actual_reps DESC
     LIMIT 1`,
    [userId, exerciseName],
  );
  if (!row) return null;
  return {
    weight: row.weight,
    actualReps: row.actual_reps,
    completedAt: row.completed_at,
    startedAt: row.started_at,
  };
}

export type RecentTopSetRow = {
  sessionId: string;
  startedAt: string;
  weight: number;
  actualReps: number | null;
};

export function listRecentExerciseTopSets(
  userId: string,
  exerciseID: string,
  sessionLimit: number,
): RecentTopSetRow[] {
  const rows = getDb().getAllSync<{
    session_id: string;
    started_at: string;
    weight: number;
    actual_reps: number | null;
  }>(
    `SELECT ws.id AS session_id,
              ws.started_at AS started_at,
              ss.weight AS weight, 
              COALESCE(ss.actual_reps, max(ss.actual_reps_left, ss.actual_reps_right)) AS actual_reps
       FROM workout_sessions ws
       JOIN session_exercises se ON se.session_id = ws.id
       JOIN session_sets ss ON ss.session_exercise_id = se.id
       WHERE ws.user_id = ?
         AND se.catalog_exercise_id = ?
         AND ss.completed = 1
         AND ss.weight IS NOT NULL 
         AND ws.status != 'cancelled'
       ORDER BY ss.weight DESC, actual_reps DESC`,
    [userId, exerciseID],
  );

  const topPerSession = new Map<string, RecentTopSetRow>();
  for (const r of rows) {
    if (!topPerSession.has(r.session_id)) {
      topPerSession.set(r.session_id, {
        sessionId: r.session_id,
        startedAt: r.started_at,
        weight: r.weight,
        actualReps: r.actual_reps,
      });
    }
  }

  return Array.from(topPerSession.values())
    .sort((a, b) => (a.startedAt < b.startedAt ? 1 : -1))
    .slice(0, sessionLimit)
    .reverse();
}

export function listRecentTopSetsByCatalogId(
  userId: string,
  catalogExerciseId: string,
  sessionLimit: number
): RecentTopSetRow[] {
  const rows = getDb().getAllSync<{
    session_id: string;
    started_at: string;
    weight: number;
    actual_reps: number | null;
  }>(
    `SELECT ws.id AS session_id,
            ws.started_at AS started_at,
            ss.weight AS weight,
            COALESCE(ss.actual_reps, max(ss.actual_reps_left, ss.actual_reps_right)) AS actual_reps
     FROM workout_sessions ws
     JOIN session_exercises se ON se.session_id = ws.id
     JOIN session_sets ss ON ss.session_exercise_id = se.id
     WHERE ws.user_id = ?
       AND se.catalog_exercise_id = ?
       AND ss.completed = 1
       AND ss.weight IS NOT NULL
       AND ws.status != 'cancelled'
     ORDER BY ss.weight DESC, actual_reps DESC`,
    [userId, catalogExerciseId]
  );

  const topPerSession = new Map<string, RecentTopSetRow>();
  for (const r of rows) {
    if (!topPerSession.has(r.session_id)) {
      topPerSession.set(r.session_id, {
        sessionId: r.session_id,
        startedAt: r.started_at,
        weight: r.weight,
        actualReps: r.actual_reps,
      });
    }
  }

  return Array.from(topPerSession.values())
    .sort((a, b) => (a.startedAt < b.startedAt ? 1 : -1))
    .slice(0, sessionLimit)
    .reverse();
}

export function listAllExerciseTopSets(
  userId: string,
  exerciseName: string,
): ExerciseTopSetRow[] {
  return getDb()
    .getAllSync<{
      id: string;
      started_at: string;
      weight: number;
      actual_reps: number | null;
    }>(
      `SELECT ws.id AS id, ws.started_at AS started_at, ss.weight AS weight,
              COALESCE(ss.actual_reps, max(ss.actual_reps_left, ss.actual_reps_right)) AS actual_reps
       FROM workout_sessions ws
       JOIN session_exercises se ON se.session_id = ws.id
       JOIN session_sets ss ON ss.session_exercise_id = se.id
       WHERE ws.user_id = ?
         AND se.name = ?
         AND ss.completed = 1
         AND ss.weight IS NOT NULL
         AND ws.status != 'cancelled'
       ORDER BY ss.weight DESC, actual_reps DESC`,
      [userId, exerciseName],
    )
    .map((r) => ({
      sessionId: r.id,
      startedAt: r.started_at,
      weight: r.weight,
      actualReps: r.actual_reps,
    }));
}
