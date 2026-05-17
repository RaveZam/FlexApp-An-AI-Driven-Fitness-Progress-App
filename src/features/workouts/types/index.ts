export type CatalogExercise = {
  id: string;
  name: string;
  muscleGroup: string | null;
  description: string | null;
};

export type Exercise = {
  id: string;
  workoutId: string;
  userId: string;
  name: string;
  catalogExerciseId: string | null;
  targetSets: number;
  targetReps: number;
  position: number;
  createdAt: string;
};

export type Workout = {
  id: string;
  userId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  exercises: Exercise[];
};

export type WorkoutInput = {
  name: string;
  exercises: Array<{
    catalogExerciseId: string;
    name: string;
    targetSets: number;
    targetReps: number;
  }>;
};
