export type SessionSetView = {
  id: string;
  setNumber: number;
  targetReps: number;
  weight: number | null;
  actualReps: number | null;
  actualRepsLeft: number | null;
  actualRepsRight: number | null;
  completed: boolean;
};

export type SessionExerciseView = {
  id: string;
  name: string;
  sets: SessionSetView[];
  isUnilateral: boolean;
};

export type ExerciseBestRecord = {
  weight: number;
  reps: number;
  date: string;
};

export type ExerciseSessionPoint = {
  sessionId: string;
  startedAt: string;
  maxWeight: number;
  repsAtMax: number;
};
