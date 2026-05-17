import { supabase } from "@/src/lib/supabase";
import type { CatalogExercise, Exercise, Workout } from "../types";

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

type SupabaseWorkout = {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
  updated_at: string;
  user_workout_exercises: SupabaseExercise[];
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
    name: row.name,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    exercises: (row.user_workout_exercises ?? []).map(toExercise),
  };
}

export async function fetchExerciseCatalog(): Promise<CatalogExercise[]> {
  const { data, error } = await supabase
    .from("workouts")
    .select("id, workout_name, muscle_group, workout_description")
    .order("workout_name", { ascending: true });

  if (error) throw error;
  return (data as { id: string; workout_name: string; muscle_group: string | null; workout_description: string | null }[]).map(
    (row) => ({
      id: row.id,
      name: row.workout_name,
      muscleGroup: row.muscle_group,
      description: row.workout_description,
    })
  );
}

export async function fetchWorkouts(userId: string): Promise<Workout[]> {
  const { data, error } = await supabase
    .from("user_workouts")
    .select("*, user_workout_exercises(*)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data as SupabaseWorkout[]).map(toWorkout);
}
