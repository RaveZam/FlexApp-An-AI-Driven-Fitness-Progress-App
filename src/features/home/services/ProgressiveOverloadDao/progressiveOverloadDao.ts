import type { SessionStatus } from "@/src/lib/dao/sessions";
import { getDb } from "@/src/lib/db";
import type {
  ExerciseRaw,
  LoggedExercise,
  LoggedSet,
  LoggedWorkout,
  SessionRaw,
  SetRaw,
} from "../../types/progressiveOverload";


// Returns the last 7 completed workouts (newest first) with their exercises and sets.
export function listLoggedWorkouts(userId: string, limit = 7): LoggedWorkout[] {
  const db = getDb();

  const sessions = db.getAllSync<SessionRaw>(
    `SELECT id, user_id, workout_id, plan_id, name, status, started_at, completed_at
     FROM workout_sessions
     WHERE user_id = ? AND status = 'completed'
     ORDER BY completed_at DESC
     LIMIT ?`,
    [userId, limit]
  );
  if (sessions.length === 0) return [];

  const sessionIds = sessions.map((s) => s.id);
  const exercises = db.getAllSync<ExerciseRaw>(
    `SELECT se.id, se.session_id, se.name, se.position, se.is_unilateral,
            c.muscle_group
     FROM session_exercises se
     LEFT JOIN exercises_catalog c ON c.id = se.catalog_exercise_id
     WHERE se.session_id IN (${sessionIds.map(() => "?").join(",")})
     ORDER BY se.position ASC`,
    sessionIds
  );

  const exerciseIds = exercises.map((e) => e.id);
  const sets = exerciseIds.length
    ? db.getAllSync<SetRaw>(
        `SELECT id, session_exercise_id, set_index, target_reps, actual_reps,
                actual_reps_left, actual_reps_right, weight, completed, completed_at
         FROM session_sets
         WHERE session_exercise_id IN (${exerciseIds.map(() => "?").join(",")})
         ORDER BY set_index ASC`,
        exerciseIds
      )
    : [];

  const setsByExercise = new Map<string, LoggedSet[]>();
  for (const s of sets) {
    const list = setsByExercise.get(s.session_exercise_id) ?? [];
    list.push({
      id: s.id,
      setIndex: s.set_index,
      targetReps: s.target_reps,
      actualReps: s.actual_reps,
      actualRepsLeft: s.actual_reps_left,
      actualRepsRight: s.actual_reps_right,
      weight: s.weight,
      completed: s.completed === 1,
      completedAt: s.completed_at,
    });
    setsByExercise.set(s.session_exercise_id, list);
  }

  const exercisesBySession = new Map<string, LoggedExercise[]>();
  for (const e of exercises) {
    const list = exercisesBySession.get(e.session_id) ?? [];
    list.push({
      id: e.id,
      name: e.name,
      muscleGroup: e.muscle_group,
      position: e.position,
      isUnilateral: e.is_unilateral === 1,
      sets: setsByExercise.get(e.id) ?? [],
    });
    exercisesBySession.set(e.session_id, list);
  }

  return sessions.map((s) => ({
    id: s.id,
    userId: s.user_id,
    workoutId: s.workout_id,
    planId: s.plan_id,
    name: s.name,
    status: s.status as SessionStatus,
    startedAt: s.started_at,
    completedAt: s.completed_at,
    exercises: exercisesBySession.get(s.id) ?? [],
  }));
}
