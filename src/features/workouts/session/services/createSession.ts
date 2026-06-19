import { enqueueOutbox } from "@/src/features/outbox";
import { getActivePlanIdForUser } from "@/src/lib/dao/preferences";
import { insertSessionExercise } from "@/src/lib/dao/sessionExercises";
import { insertSession } from "@/src/lib/dao/sessions";
import { insertSessionSet } from "@/src/lib/dao/sessionSets";
import { listWorkoutExercisesByWorkout } from "@/src/lib/dao/workoutExercises";
import { getWorkoutById, getWorkoutIDForDay } from "@/src/lib/dao/workouts";
import { getDb } from "@/src/lib/db";
import { generateUUID } from "@/src/lib/uuid";

// Snapshots today's workout into a fresh in-progress session: the session row,
// a copy of each workout exercise, and an empty set row per target set. Writes
// locally then queues the session for Supabase sync. Returns the new session id,
// or null when there is no active plan / nothing scheduled today.

export default function createSession(userId: string | null) {
  if (!userId) return null;
  const planId = getActivePlanIdForUser(userId);

  if (!planId) return null;

  const today = new Date().getDay();
  const workoutId = getWorkoutIDForDay(planId, today);
  if (!workoutId) return null;

  const workout = getWorkoutById(workoutId);
  if (!workout) return null;

  const exercises = listWorkoutExercisesByWorkout(workoutId); // sorted by position
  const now = new Date().toISOString();
  const sessionId = generateUUID();

  // Built alongside the SQLite writes so the outbox payload is a full snapshot
  // of the session at creation time, rather than something sync re-reads later.
  const exercisePayloads: {
    id: string;
    sourceExerciseId: string | null;
    catalogExerciseId: string | null;
    name: string;
    targetSets: number;
    targetReps: number;
    position: number;
    isUnilateral: boolean;
    sets: { id: string; setIndex: number; targetReps: number }[];
  }[] = [];

  getDb().withTransactionSync(() => {
    insertSession({
      id: sessionId,
      userId,
      workoutId,
      planId,
      name: workout.name,
      status: "in_progress",
      startedAt: now,
      completedAt: null,
      createdAt: now,
      updatedAt: now,
    });

    for (const ex of exercises) {
      const sessionExerciseId = generateUUID();
      insertSessionExercise({
        id: sessionExerciseId,
        sessionId,
        sourceExerciseId: ex.id,
        catalogExerciseId: ex.catalogExerciseId,
        name: ex.name,
        targetSets: ex.targetSets,
        targetReps: ex.targetReps,
        position: ex.position,
        isUnilateral: ex.isUnilateral,
      });

      const sets: { id: string; setIndex: number; targetReps: number }[] = [];
      for (let i = 0; i < ex.targetSets; i++) {
        const setId = generateUUID();
        insertSessionSet({
          id: setId,
          sessionExerciseId,
          setIndex: i,
          targetReps: ex.targetReps,
        });
        sets.push({ id: setId, setIndex: i, targetReps: ex.targetReps });
      }

      exercisePayloads.push({
        id: sessionExerciseId,
        sourceExerciseId: ex.id,
        catalogExerciseId: ex.catalogExerciseId,
        name: ex.name,
        targetSets: ex.targetSets,
        targetReps: ex.targetReps,
        position: ex.position,
        isUnilateral: ex.isUnilateral,
        sets,
      });
    }

    enqueueOutbox({
      entityType: "workout_session",
      entityId: sessionId,
      operation: "create",
      payload: {
        sessionId,
        userId,
        workoutId,
        planId,
        name: workout.name,
        startedAt: now,
        exercises: exercisePayloads,
      },
    });
  });

  return sessionId;
}
