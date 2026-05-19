import { enqueueOutbox } from "@/src/features/outbox";
import * as sessionsDao from "@/src/lib/dao/sessions";
import * as sessionExercisesDao from "@/src/lib/dao/sessionExercises";
import * as sessionSetsDao from "@/src/lib/dao/sessionSets";
import { getDb } from "@/src/lib/db";
import { generateUUID } from "@/src/lib/uuid";
import type { Workout, WorkoutSession } from "../types";

function hydrate(session: sessionsDao.SessionRow): WorkoutSession {
  const exercises = sessionExercisesDao.listBySession(session.id).map((ex) => ({
    ...ex,
    sets: sessionSetsDao.listByExercise(ex.id),
  }));
  return { ...session, exercises };
}

export function getActiveSession(userId: string): WorkoutSession | null {
  const session = sessionsDao.getActive(userId);
  return session ? hydrate(session) : null;
}

export function getSessionById(sessionId: string): WorkoutSession | null {
  const session = sessionsDao.getById(sessionId);
  return session ? hydrate(session) : null;
}

export function createSessionFromWorkout(userId: string, workout: Workout): WorkoutSession {
  const db = getDb();
  const now = new Date().toISOString();
  const sessionId = generateUUID();

  db.withTransactionSync(() => {
    sessionsDao.insert({
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
      sessionExercisesDao.insert({
        id: sessionExerciseId,
        sessionId,
        sourceExerciseId: ex.id,
        catalogExerciseId: ex.catalogExerciseId ?? null,
        name: ex.name,
        targetSets: ex.targetSets,
        targetReps: ex.targetReps,
        position: ex.position,
      });
      for (let i = 0; i < ex.targetSets; i++) {
        sessionSetsDao.insert({
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
  sessionsDao.updateStatus(sessionId, "completed", now, now);
  enqueueOutbox({
    entityType: "workout_session",
    entityId: sessionId,
    operation: "update",
    payload: { status: "completed", completedAt: now },
  });
}

export function cancelSession(sessionId: string): void {
  const now = new Date().toISOString();
  sessionsDao.updateStatus(sessionId, "cancelled", now, now);
  enqueueOutbox({
    entityType: "workout_session",
    entityId: sessionId,
    operation: "update",
    payload: { status: "cancelled", completedAt: now },
  });
}

export function deleteSession(sessionId: string): void {
  const db = getDb();
  db.withTransactionSync(() => {
    sessionSetsDao.deleteBySession(sessionId);
    sessionExercisesDao.deleteBySession(sessionId);
    sessionsDao.remove(sessionId);
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
  const sessionIds = sessionsDao.listIdsByUser(userId);
  db.withTransactionSync(() => {
    for (const id of sessionIds) {
      sessionSetsDao.deleteBySession(id);
      sessionExercisesDao.deleteBySession(id);
      sessionsDao.remove(id);
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
  patch: { actualReps?: number; weight?: number; completed?: boolean }
): void {
  const now = new Date().toISOString();
  const current = sessionSetsDao.getById(setId);
  if (!current) return;
  const actualReps = patch.actualReps !== undefined ? patch.actualReps : current.actualReps;
  const weight = patch.weight !== undefined ? patch.weight : current.weight;
  const completed = patch.completed !== undefined ? patch.completed : current.completed;
  const completedAt = completed ? now : null;

  sessionSetsDao.update({ id: setId, actualReps, weight, completed, completedAt });
  enqueueOutbox({
    entityType: "session_set",
    entityId: setId,
    operation: "update",
    payload: { actualReps, weight, completed, completedAt },
  });
}
