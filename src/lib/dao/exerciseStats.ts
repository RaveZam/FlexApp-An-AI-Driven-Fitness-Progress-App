import { getDb } from "@/src/lib/db";

// Unilateral sets log actual_reps_left/actual_reps_right instead of
// actual_reps — this picks whichever is populated. Shared by every query
// below so the rep-calculation rule only has to be right in one place.
const TOP_SET_REPS_SQL =
  "COALESCE(ss.actual_reps, max(ss.actual_reps_left, ss.actual_reps_right))";

// Rows are pre-ordered by weight DESC, actual_reps DESC (heaviest set first,
// reps as tiebreaker), so keeping the first row seen per session gives each
// session's top set.
function topRowPerSession<T extends { session_id: string }>(rows: T[]): T[] {
  const seen = new Map<string, T>();
  for (const r of rows) if (!seen.has(r.session_id)) seen.set(r.session_id, r);
  return [...seen.values()];
}

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
  userId: string | null,
  catalogExerciseId: string,
): ExerciseBestRow | null {
  if (!userId) return null;
  const row = getDb().getFirstSync<{
    weight: number;
    actual_reps: number | null;
    completed_at: string | null;
    started_at: string;
  }>(
    `SELECT ss.weight,
            ${TOP_SET_REPS_SQL} AS actual_reps,
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
            ${TOP_SET_REPS_SQL} AS actual_reps,
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
            ${TOP_SET_REPS_SQL} AS actual_reps
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

  return topRowPerSession(rows)
    .map((r) => ({
      sessionId: r.session_id,
      startedAt: r.started_at,
      weight: r.weight,
      actualReps: r.actual_reps,
    }))
    .sort((a, b) => (a.startedAt < b.startedAt ? 1 : -1))
    .slice(0, sessionLimit)
    .reverse();
}

export function listRecentTopSetsByCatalogId(
  userId: string | null,
  catalogExerciseId: string,
  sessionLimit: number,
): RecentTopSetRow[] {
  if (!userId) return [];
  const rows = getDb().getAllSync<{
    session_id: string;
    started_at: string;
    weight: number;
    actual_reps: number | null;
  }>(
    `SELECT ws.id AS session_id,
            ws.started_at AS started_at,
            ss.weight AS weight,
            ${TOP_SET_REPS_SQL} AS actual_reps
     FROM workout_sessions ws
     JOIN session_exercises se ON se.session_id = ws.id
     JOIN session_sets ss ON ss.session_exercise_id = se.id
     WHERE ws.user_id = ?
       AND se.catalog_exercise_id = ?
       AND ss.completed = 1
       AND ss.weight IS NOT NULL
       AND ws.status != 'cancelled'
     ORDER BY ss.weight DESC, actual_reps DESC`,
    [userId, catalogExerciseId],
  );

  return topRowPerSession(rows)
    .map((r) => ({
      sessionId: r.session_id,
      startedAt: r.started_at,
      weight: r.weight,
      actualReps: r.actual_reps,
    }))
    .sort((a, b) => (a.startedAt < b.startedAt ? 1 : -1))
    .slice(0, sessionLimit)
    .reverse();
}

export type UserExerciseTopSetRow = {
  exerciseName: string;
  muscleGroup: string | null;
  sessionId: string;
  startedAt: string;
  weight: number;
  actualReps: number | null;
};

// Same per-session top-set selection as listRecentTopSetsByCatalogId
// (heaviest completed set, tie-broken by reps) but across every exercise the
// user has logged rather than one catalog id, so callers building a
// dashboard don't have to reimplement that selection logic in JS.
//
// Only counts finished workouts with an actual logged weight above zero —
// this feeds a historical PR/trend dashboard, not a live in-workout view, so
// an in-progress session or a zero-weight placeholder set shouldn't appear
// as a data point.
export function listRecentTopSetsByUser(
  userId: string | null,
): UserExerciseTopSetRow[] {
  if (!userId) return [];

  const rows = getDb().getAllSync<{
    exercise_name: string;
    muscle_group: string | null;
    session_id: string;
    started_at: string;
    weight: number;
    actual_reps: number | null;
  }>(
    `SELECT se.name AS exercise_name,
            c.muscle_group AS muscle_group,
            ws.id AS session_id,
            ws.started_at AS started_at,
            ss.weight AS weight,
            ${TOP_SET_REPS_SQL} AS actual_reps
     FROM workout_sessions ws
     JOIN session_exercises se ON se.session_id = ws.id
     JOIN session_sets ss ON ss.session_exercise_id = se.id
     LEFT JOIN exercises_catalog c ON c.id = se.catalog_exercise_id
     WHERE ws.user_id = ?
       AND ss.completed = 1
       AND ss.weight IS NOT NULL
       AND ss.weight > 0
       AND ws.status = 'completed'
     ORDER BY se.name, ss.weight DESC, actual_reps DESC`,
    [userId],
  );

  // Dedup key needs the exercise name too — topRowPerSession alone only
  // dedupes by session, which would collapse different exercises logged in
  // the same session into one row.
  const seen = new Map<string, (typeof rows)[number]>();
  for (const r of rows) {
    const key = `${r.exercise_name}|${r.session_id}`;
    if (!seen.has(key)) seen.set(key, r);
  }

  return [...seen.values()].map((r) => ({
    exerciseName: r.exercise_name,
    muscleGroup: r.muscle_group,
    sessionId: r.session_id,
    startedAt: r.started_at,
    weight: r.weight,
    actualReps: r.actual_reps,
  }));
}

export type SessionSetDetail = {
  setIndex: number;
  targetReps: number;
  actualReps: number | null;
  actualRepsLeft: number | null;
  actualRepsRight: number | null;
  weight: number | null;
  completed: boolean;
};

// Every set (not just the top set) an exercise had in one specific session —
// same se.name matching convention as listRecentTopSetsByUser — used to fill
// in the per-session detail panel of the exercise history modal.
export function listSessionSetsForExercise(
  userId: string | null,
  sessionId: string,
  exerciseName: string,
): SessionSetDetail[] {
  if (!userId) return [];
  return getDb()
    .getAllSync<{
      set_index: number;
      target_reps: number;
      actual_reps: number | null;
      actual_reps_left: number | null;
      actual_reps_right: number | null;
      weight: number | null;
      completed: number;
    }>(
      `SELECT ss.set_index, ss.target_reps, ss.actual_reps,
              ss.actual_reps_left, ss.actual_reps_right,
              ss.weight, ss.completed
       FROM session_sets ss
       JOIN session_exercises se ON ss.session_exercise_id = se.id
       JOIN workout_sessions ws ON se.session_id = ws.id
       WHERE ws.user_id = ? AND ws.id = ? AND se.name = ?
       ORDER BY ss.set_index ASC`,
      [userId, sessionId, exerciseName],
    )
    .map((r) => ({
      setIndex: r.set_index,
      targetReps: r.target_reps,
      actualReps: r.actual_reps,
      actualRepsLeft: r.actual_reps_left,
      actualRepsRight: r.actual_reps_right,
      weight: r.weight,
      completed: r.completed === 1,
    }));
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
              ${TOP_SET_REPS_SQL} AS actual_reps
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
