import { enqueueOutbox } from "@/src/features/outbox";
import {
  getActivePlanIdForUser,
  resolveActiveWorkoutId,
} from "@/src/lib/dao/preferences";
import { insertSessionExercise } from "@/src/lib/dao/sessionExercises";
import { insertSession } from "@/src/lib/dao/sessions";
import { insertSessionSet } from "@/src/lib/dao/sessionSets";
import { listWorkoutExercisesByWorkout } from "@/src/lib/dao/workoutExercises";
import { getWorkoutById } from "@/src/lib/dao/workouts";
import { getDb } from "@/src/lib/db";
import { generateUUID } from "@/src/lib/uuid";

export default function createSession(userId: string | null) {
  if (!userId) return null;
  const planId = getActivePlanIdForUser(userId);

  if (!planId) return null;

  //Returns a active workout id, it checks if there is a override for the current day, if not it gets the workout for the current day
  const resolvedWorkoutId = resolveActiveWorkoutId(userId, planId);
  if (!resolvedWorkoutId) return null;

  //Gets the workout data from workout_id
  const workout = getWorkoutById(resolvedWorkoutId);
  if (!workout) return null;

  const exercises = listWorkoutExercisesByWorkout(resolvedWorkoutId); // sorted by position
  const now = new Date().toISOString();
  const sessionId = generateUUID();

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
      workoutId: resolvedWorkoutId,
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
        workoutId: resolvedWorkoutId,
        planId,
        name: workout.name,
        startedAt: now,
        exercises: exercisePayloads,
      },
    });
  });

  return sessionId;
}
