import { enqueueOutbox } from "@/src/features/outbox";
import * as catalogDao from "@/src/lib/dao/catalog";
import * as plansDao from "@/src/lib/dao/plans";
import * as workoutDaysDao from "@/src/lib/dao/workoutDays";
import * as workoutExercisesDao from "@/src/lib/dao/workoutExercises";
import * as workoutsDao from "@/src/lib/dao/workouts";
import { getDb } from "@/src/lib/db";
import type { CatalogExercise, Exercise, Workout, WorkoutPlan } from "../types";

function hydrateWorkouts(workoutRows: workoutsDao.WorkoutRow[]): Workout[] {
  const daysByWorkout = workoutDaysDao.listWorkoutDaysByWorkoutIds(
    workoutRows.map((w) => w.id),
  );
  return workoutRows.map((w) => ({
    ...w,
    daysOfWeek: daysByWorkout.get(w.id) ?? [],
    exercises: workoutExercisesDao.listWorkoutExercisesByWorkout(w.id),
  }));
}

export function listPlans(userId: string): WorkoutPlan[] {
  return plansDao.listPlansByUser(userId).map((p) => ({
    ...p,
    workouts: hydrateWorkouts(workoutsDao.listWorkoutsByPlan(p.id)),
  }));
}

export function insertPlanLocal(plan: WorkoutPlan): void {
  const db = getDb();
  db.withTransactionSync(() => {
    plansDao.insertPlan(plan);
    enqueueOutbox({
      entityType: "workout_plan",
      entityId: plan.id,
      operation: "create",
      payload: {
        plan: {
          id: plan.id,
          user_id: plan.userId,
          name: plan.name,
          created_at: plan.createdAt,
          updated_at: plan.updatedAt,
        },
      },
    });
  });
}

export function listWorkouts(userId: string): Workout[] {
  return hydrateWorkouts(workoutsDao.listWorkoutsByUser(userId));
}

export function listExerciseCatalog(): CatalogExercise[] {
  return catalogDao.listCatalogExercises().map((r) => ({
    id: r.id,
    name: r.name,
    muscleGroup: r.muscleGroup,
    description: r.description,
    isUnilateral: r.isUnilateral,
  }));
}

export function updateWorkoutDays(
  workoutId: string,
  daysOfWeek: number[],
): void {
  const db = getDb();
  const now = new Date().toISOString();
  db.withTransactionSync(() => {
    workoutDaysDao.replaceWorkoutDays(workoutId, daysOfWeek, now);
    workoutsDao.touchWorkoutUpdatedAt(workoutId, now);
    enqueueOutbox({
      entityType: "workout_days",
      entityId: workoutId,
      operation: "update",
      payload: { workout_id: workoutId, days: daysOfWeek, updated_at: now },
    });
  });
}

export function addExerciseToWorkout(exercise: Exercise): void {
  const db = getDb();
  db.withTransactionSync(() => {
    workoutExercisesDao.insertWorkoutExercise(exercise);
    enqueueOutbox({
      entityType: "workout_exercise",
      entityId: exercise.id,
      operation: "create",
      payload: {
        exercise: {
          id: exercise.id,
          workout_id: exercise.workoutId,
          user_id: exercise.userId,
          name: exercise.name,
          catalog_exercise_id: exercise.catalogExerciseId,
          target_sets: exercise.targetSets,
          target_reps: exercise.targetReps,
          position: exercise.position,
          is_unilateral: exercise.isUnilateral,
          created_at: exercise.createdAt,
        },
      },
    });
  });
}

export function removeExerciseFromWorkout(exerciseId: string): void {
  const db = getDb();
  db.withTransactionSync(() => {
    workoutExercisesDao.deleteWorkoutExerciseById(exerciseId);
    enqueueOutbox({
      entityType: "workout_exercise",
      entityId: exerciseId,
      operation: "delete",
      payload: {},
    });
  });
}

export function updateExerciseTargets(
  exerciseId: string,
  targetSets: number,
  targetReps: number,
): void {
  const db = getDb();
  db.withTransactionSync(() => {
    workoutExercisesDao.updateWorkoutExerciseTargets(
      exerciseId,
      targetSets,
      targetReps,
    );
    enqueueOutbox({
      entityType: "workout_exercise",
      entityId: exerciseId,
      operation: "update",
      payload: { targetSets, targetReps },
    });
  });
}

export function insertWorkoutLocal(workout: Workout): void {
  const db = getDb();
  db.withTransactionSync(() => {
    workoutsDao.insertWorkout(workout);
    workoutDaysDao.replaceWorkoutDays(
      workout.id,
      workout.daysOfWeek,
      workout.createdAt,
    );
    for (const e of workout.exercises) {
      workoutExercisesDao.insertWorkoutExercise(e);
    }
    enqueueOutbox({
      entityType: "workout",
      entityId: workout.id,
      operation: "create",
      payload: {
        version: 1,
        workout: {
          id: workout.id,
          user_id: workout.userId,
          plan_id: workout.planId,
          name: workout.name,
          created_at: workout.createdAt,
          updated_at: workout.updatedAt,
        },
        days: workout.daysOfWeek,
        exercises: workout.exercises.map((e) => ({
          id: e.id,
          workout_id: e.workoutId,
          user_id: e.userId,
          name: e.name,
          catalog_exercise_id: e.catalogExerciseId,
          target_sets: e.targetSets,
          target_reps: e.targetReps,
          position: e.position,
          is_unilateral: e.isUnilateral,
          created_at: e.createdAt,
        })),
      },
    });
  });
}
