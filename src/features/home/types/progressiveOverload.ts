// One exercise's top set in a single session, used for the progression chart.
export type ExercisePoint = {
  sessionId: string;
  startedAt: string;
  weight: number;
  reps: number;
};

export type ExerciseProgress = {
  name: string;
  muscleGroup: string | null;
  points: ExercisePoint[];
};