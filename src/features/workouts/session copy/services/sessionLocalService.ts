import { enqueueOutbox } from "@/src/features/outbox";
import * as sessionExercisesDao from "@/src/lib/dao/sessionExercises";
import * as sessionsDao from "@/src/lib/dao/sessions";
import * as sessionSetsDao from "@/src/lib/dao/sessionSets";
import { getDb } from "@/src/lib/db";
import { generateUUID } from "@/src/lib/uuid";
import type { Workout, WorkoutSession } from "../../types";

function hydrate(session: sessionsDao.SessionRow): WorkoutSession {
  const exercises = sessionExercisesDao.listSessionExercisesBySession(session.id).map((ex) => ({
    ...ex,
    sets: sessionSetsDao.listSessionSetsByExercise(ex.id),
  }));
  return { ...session, exercises };
}

export function getActiveSession(userId: string): WorkoutSession | null {
  const session = sessionsDao.getActiveSessionForUser(userId);
  return session ? hydrate(session) : null;
}

export function getSessionById(sessionId: string): WorkoutSession | null {
  const session = sessionsDao.getSessionById(sessionId);
  return session ? hydrate(session) : null;
}

export function createSessionFromWorkout(userId: string, workout: Workout): WorkoutSession {
  const db = getDb();
  const now = new Date().toISOString();
  const sessionId = generateUUID();

  db.withTransactionSync(() => {
    sessionsDao.insertSession({
      id: sessionId,
      userId,
      workoutId: workout.id,
      planId: workout.planId ?? null,
      name: workout.name,
      status: "in_progress",
      startedAt: now,
      completedAt: null,
      createdAt: now,
      updatedAt: now,
    });

    const sortedExercises = [...workout.exercises].sort((a, b) => a.position - b.position);
    for (const ex of sortedExercises) {
      const sessionExerciseId = generateUUID();
      sessionExercisesDao.insertSessionExercise({
        id: sessionExerciseId,
        sessionId,
        sourceExerciseId: ex.id,
        catalogExerciseId: ex.catalogExerciseId ?? null,
        name: ex.name,
        targetSets: ex.targetSets,
        targetReps: ex.targetReps,
        position: ex.position,
        isUnilateral: ex.isUnilateral,
      });
      for (let i = 0; i < ex.targetSets; i++) {
        sessionSetsDao.insertSessionSet({
          id: generateUUID(),
          sessionExerciseId,
          setIndex: i,
          targetReps: ex.targetReps,
        });
      }
    }

    enqueueOutbox({
      entityType: "workout_session",
      entityId: sessionId,
      operation: "create",
      payload: {
        sessionId,
        userId,
        workoutId: workout.id,
        planId: workout.planId ?? null,
        name: workout.name,
        startedAt: now,
      },
    });
  });

  return getSessionById(sessionId)!;
}

export function completeSession(sessionId: string): void {
  const now = new Date().toISOString();
  sessionsDao.updateSessionStatus(sessionId, "completed", now, now);
  enqueueOutbox({
    entityType: "workout_session",
    entityId: sessionId,
    operation: "update",
    payload: { status: "completed", completedAt: now },
  });
}

export function cancelSession(sessionId: string): void {
  const now = new Date().toISOString();
  sessionsDao.updateSessionStatus(sessionId, "cancelled", now, now);
  enqueueOutbox({
    entityType: "workout_session",
    entityId: sessionId,
    operation: "update",
    payload: { status: "cancelled", completedAt: now },
  });
}

export function cancelAllInProgressForUser(userId: string): void {
  const ids = sessionsDao.listInProgressSessionIdsByUser(userId);
  for (const id of ids) cancelSession(id);
}

export function deleteSession(sessionId: string): void {
  const db = getDb();
  db.withTransactionSync(() => {
    sessionSetsDao.deleteSessionSetsBySession(sessionId);
    sessionExercisesDao.deleteSessionExercisesBySession(sessionId);
    sessionsDao.deleteSession(sessionId);
    enqueueOutbox({
      entityType: "workout_session",
      entityId: sessionId,
      operation: "delete",
      payload: {},
    });
  });
}

export function deleteAllSessionsForUser(userId: string): void {
  const db = getDb();
  const sessionIds = sessionsDao.listSessionIdsByUser(userId);
  db.withTransactionSync(() => {
    for (const id of sessionIds) {
      sessionSetsDao.deleteSessionSetsBySession(id);
      sessionExercisesDao.deleteSessionExercisesBySession(id);
      sessionsDao.deleteSession(id);
      enqueueOutbox({
        entityType: "workout_session",
        entityId: id,
        operation: "delete",
        payload: {},
      });
    }
  });
}

export function updateSet(
  setId: string,
  patch: {
    actualReps?: number | null;
    actualRepsLeft?: number | null;
    actualRepsRight?: number | null;
    weight?: number;
    completed?: boolean;
  }
): void {
  const now = new Date().toISOString();
  const current = sessionSetsDao.getSessionSetById(setId);
  if (!current) return;
  const actualReps = patch.actualReps !== undefined ? patch.actualReps : current.actualReps;
  const actualRepsLeft =
    patch.actualRepsLeft !== undefined ? patch.actualRepsLeft : current.actualRepsLeft;
  const actualRepsRight =
    patch.actualRepsRight !== undefined ? patch.actualRepsRight : current.actualRepsRight;
  const weight = patch.weight !== undefined ? patch.weight : current.weight;
  const completed = patch.completed !== undefined ? patch.completed : current.completed;
  const completedAt = completed ? now : null;

  sessionSetsDao.updateSessionSet({
    id: setId,
    actualReps,
    actualRepsLeft,
    actualRepsRight,
    weight,
    completed,
    completedAt,
  });
  enqueueOutbox({
    entityType: "session_set",
    entityId: setId,
    operation: "update",
    payload: { actualReps, actualRepsLeft, actualRepsRight, weight, completed, completedAt },
  });
}
