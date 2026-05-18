export type SessionSetView = {
  id: string;
  setNumber: number;
  targetReps: number;
  weight: number | null;
  actualReps: number | null;
  completed: boolean;
};

export type SessionExerciseView = {
  id: string;
  name: string;
  sets: SessionSetView[];
  restSeconds: number;
};
