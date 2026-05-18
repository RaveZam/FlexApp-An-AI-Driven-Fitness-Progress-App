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
  planId: string;
  name: string;
  daysOfWeek: number[]; // 0=Sun … 6=Sat
  createdAt: string;
  updatedAt: string;
  exercises: Exercise[];
};

export type WorkoutPlan = {
  id: string;
  userId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  workouts: Workout[];
};

export type WorkoutInput = {
  planId: string;
  name: string;
  daysOfWeek: number[];
  exercises: {
    catalogExerciseId: string;
    name: string;
    targetSets: number;
    targetReps: number;
  }[];
};

export type WorkoutPlanInput = {
  name: string;
};

export type SessionStatus = "in_progress" | "completed" | "cancelled";

export type SessionSet = {
  id: string;
  sessionExerciseId: string;
  setIndex: number;
  targetReps: number;
  actualReps: number | null;
  weight: number | null;
  completed: boolean;
  completedAt: string | null;
};

export type SessionExercise = {
  id: string;
  sessionId: string;
  sourceExerciseId: string | null;
  catalogExerciseId: string | null;
  name: string;
  targetSets: number;
  targetReps: number;
  position: number;
  sets: SessionSet[];
};

export type WorkoutSession = {
  id: string;
  userId: string;
  workoutId: string;
  planId: string | null;
  name: string;
  status: SessionStatus;
  startedAt: string;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
  exercises: SessionExercise[];
};

export type UserPreferences = {
  userId: string;
  activePlanId: string | null;
  updatedAt: string;
};
