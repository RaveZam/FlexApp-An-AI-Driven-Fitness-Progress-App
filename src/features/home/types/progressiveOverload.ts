import type { SessionStatus } from "@/src/lib/dao/sessions";

export type LoggedSet = {
  id: string;
  setIndex: number;
  targetReps: number;
  actualReps: number | null;
  actualRepsLeft: number | null;
  actualRepsRight: number | null;
  weight: number | null;
  completed: boolean;
  completedAt: string | null;
};

export type LoggedExercise = {
  id: string;
  name: string;
  muscleGroup: string | null;
  position: number;
  isUnilateral: boolean;
  sets: LoggedSet[];
};

export type LoggedWorkout = {
  id: string;
  userId: string;
  workoutId: string;
  planId: string | null;
  name: string;
  status: SessionStatus;
  startedAt: string;
  completedAt: string | null;
  exercises: LoggedExercise[];
};

// One exercise's top set in a single session, used for the progression chart.
export type ExercisePoint = {
  sessionId: string;
  completedAt: string | null;
  weight: number;
  reps: number;
};

export type ExerciseProgress = {
  name: string;
  muscleGroup: string | null;
  points: ExercisePoint[];
};

export type SessionRaw = {
  id: string;
  user_id: string;
  workout_id: string;
  plan_id: string | null;
  name: string;
  status: string;
  started_at: string;
  completed_at: string | null;
};

export type ExerciseRaw = {
  id: string;
  session_id: string;
  name: string;
  muscle_group: string | null;
  position: number;
  is_unilateral: number;
};

export type SetRaw = {
  id: string;
  session_exercise_id: string;
  set_index: number;
  target_reps: number;
  actual_reps: number | null;
  actual_reps_left: number | null;
  actual_reps_right: number | null;
  weight: number | null;
  completed: number;
  completed_at: string | null;
};