import { getDb } from "@/src/lib/db";
import * as plansDao from "@/src/lib/dao/plans";
import * as workoutsDao from "@/src/lib/dao/workouts";
import * as workoutExercisesDao from "@/src/lib/dao/workoutExercises";
import * as workoutDaysDao from "@/src/lib/dao/workoutDays";
import type { Workout, WorkoutPlan } from "../types";

function hydrateWorkouts(workoutRows: workoutsDao.WorkoutRow[]): Workout[] {
  const daysByWorkout = workoutDaysDao.listByWorkoutIds(workoutRows.map((w) => w.id));
  return workoutRows.map((w) => ({
    ...w,
    daysOfWeek: daysByWorkout.get(w.id) ?? [],
    exercises: workoutExercisesDao.listByWorkout(w.id),
  }));
}

export function listPlans(userId: string): WorkoutPlan[] {
  return plansDao.listByUser(userId).map((p) => ({
    ...p,
    workouts: hydrateWorkouts(workoutsDao.listByPlan(p.id)),
  }));
}

export function insertPlanLocal(plan: WorkoutPlan): void {
  plansDao.insert(plan);
}

export function upsertPlans(plans: WorkoutPlan[]): void {
  const db = getDb();
  db.withTransactionSync(() => {
    for (const p of plans) {
      plansDao.upsert(p);
      for (const w of p.workouts) {
        const existingUpdatedAt = workoutsDao.getUpdatedAt(w.id);
        const remoteIsNewer = !existingUpdatedAt || w.updatedAt >= existingUpdatedAt;

        workoutsDao.upsert(w);
        if (remoteIsNewer) {
          workoutDaysDao.replace(w.id, w.daysOfWeek, w.updatedAt);
        }
        for (const e of w.exercises) {
          workoutExercisesDao.upsert(e);
        }
      }
    }
  });
}

export function listWorkouts(userId: string): Workout[] {
  return hydrateWorkouts(workoutsDao.listByUser(userId));
}

export function upsertWorkouts(workouts: Workout[]): void {
  const db = getDb();
  db.withTransactionSync(() => {
    for (const w of workouts) {
      const existingUpdatedAt = workoutsDao.getUpdatedAt(w.id);
      const remoteIsNewer = !existingUpdatedAt || w.updatedAt >= existingUpdatedAt;

      workoutsDao.upsert(w);
      if (remoteIsNewer) {
        workoutDaysDao.replace(w.id, w.daysOfWeek, w.updatedAt);
      }
      for (const e of w.exercises) {
        workoutExercisesDao.upsert(e);
      }
    }
  });
}

export function updateWorkoutDays(workoutId: string, daysOfWeek: number[]): void {
  const db = getDb();
  const now = new Date().toISOString();
  db.withTransactionSync(() => {
    workoutDaysDao.replace(workoutId, daysOfWeek, now);
    workoutsDao.touch(workoutId, now);
  });
}

export function insertWorkoutLocal(workout: Workout): void {
  const db = getDb();
  db.withTransactionSync(() => {
    workoutsDao.insert(workout);
    workoutDaysDao.replace(workout.id, workout.daysOfWeek, workout.createdAt);
    for (const e of workout.exercises) {
      workoutExercisesDao.insert(e);
    }
  });
}
