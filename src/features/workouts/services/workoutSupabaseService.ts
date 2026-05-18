import { supabase } from "@/src/lib/supabase";
import type { CatalogExercise, Exercise, Workout, WorkoutPlan } from "../types";

type SupabaseExercise = {
  id: string;
  workout_id: string;
  user_id: string;
  name: string;
  catalog_exercise_id: string | null;
  target_sets: number;
  target_reps: number;
  position: number;
  created_at: string;
};

type SupabaseWorkoutDay = {
  day_of_week: number;
};

type SupabaseWorkout = {
  id: string;
  user_id: string;
  plan_id: string;
  name: string;
  created_at: string;
  updated_at: string;
  user_workout_exercises: SupabaseExercise[];
  user_workout_days: SupabaseWorkoutDay[];
};

type SupabasePlan = {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
  updated_at: string;
  user_workouts: SupabaseWorkout[];
};

function toExercise(row: SupabaseExercise): Exercise {
  return {
    id: row.id,
    workoutId: row.workout_id,
    userId: row.user_id,
    name: row.name,
    catalogExerciseId: row.catalog_exercise_id,
    targetSets: row.target_sets,
    targetReps: row.target_reps,
    position: row.position,
    createdAt: row.created_at,
  };
}

function toWorkout(row: SupabaseWorkout): Workout {
  return {
    id: row.id,
    userId: row.user_id,
    planId: row.plan_id,
    name: row.name,
    daysOfWeek: (row.user_workout_days ?? [])
      .map((d) => d.day_of_week)
      .sort((a, b) => a - b),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    exercises: (row.user_workout_exercises ?? []).map(toExercise),
  };
}

function toPlan(row: SupabasePlan): WorkoutPlan {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    workouts: (row.user_workouts ?? []).map(toWorkout),
  };
}

export async function fetchExerciseCatalog(): Promise<CatalogExercise[]> {
  const { data, error } = await supabase
    .from("exercises_catalog")
    .select("id, name, muscle_group, description")
    .order("name", { ascending: true });

  if (error) throw error;
  return (data as { id: string; name: string; muscle_group: string | null; description: string | null }[]).map(
    (row) => ({
      id: row.id,
      name: row.name,
      muscleGroup: row.muscle_group,
      description: row.description,
    })
  );
}

export async function fetchPlans(userId: string): Promise<WorkoutPlan[]> {
  const { data, error } = await supabase
    .from("user_workout_plans")
    .select("*, user_workouts(*, user_workout_exercises(*), user_workout_days(day_of_week))")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data as SupabasePlan[]).map(toPlan);
}

export async function fetchWorkouts(userId: string): Promise<Workout[]> {
  const { data, error } = await supabase
    .from("user_workouts")
    .select("*, user_workout_exercises(*), user_workout_days(day_of_week)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data as SupabaseWorkout[]).map(toWorkout);
}
