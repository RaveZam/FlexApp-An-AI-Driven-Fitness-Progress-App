import type {
  ExerciseBestRecord,
  ExerciseSessionPoint,
} from "@/src/features/workouts/session/sessionView";

export type ProgressionExercise = {
  id: string;
  name: string;
  muscleGroup: string;
  isUnilateral: boolean;
  points: ExerciseSessionPoint[];
  best: ExerciseBestRecord;
};

export type { ExerciseBestRecord, ExerciseSessionPoint };
