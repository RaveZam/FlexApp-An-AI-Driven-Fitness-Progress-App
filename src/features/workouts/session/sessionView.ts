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

// One exercise snapshotted into a session — the shape the session UI consumes.
// The data layer maps its SQLite row to this; components depend on this, not the row.
export type SessionExercise = {
  id: string;
  sessionId: string;
  sourceExerciseId: string | null;
  catalogExerciseId: string | null;
  name: string;
  targetSets: number;
  targetReps: number;
  position: number;
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
