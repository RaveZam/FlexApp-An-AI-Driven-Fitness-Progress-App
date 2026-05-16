export type WorkoutSet = {
  id: string;
  setNumber: number;
  targetReps: number;
  weight: number | null;
  actualReps: number | null;
  completed: boolean;
};

export type Exercise = {
  id: string;
  name: string;
  sets: WorkoutSet[];
  restSeconds: number;
};

export type WorkoutSession = {
  id: string;
  name: string;
  exercises: Exercise[];
};

export const MOCK_WORKOUT_SESSION: WorkoutSession = {
  id: "session-1",
  name: "Push Day",
  exercises: [
    {
      id: "ex-1",
      name: "Bench Press",
      restSeconds: 90,
      sets: [
        { id: "s1", setNumber: 1, targetReps: 10, weight: null, actualReps: null, completed: false },
        { id: "s2", setNumber: 2, targetReps: 10, weight: null, actualReps: null, completed: false },
        { id: "s3", setNumber: 3, targetReps: 8, weight: null, actualReps: null, completed: false },
        { id: "s4", setNumber: 4, targetReps: 8, weight: null, actualReps: null, completed: false },
      ],
    },
    {
      id: "ex-2",
      name: "Incline Dumbbell Press",
      restSeconds: 75,
      sets: [
        { id: "s5", setNumber: 1, targetReps: 12, weight: null, actualReps: null, completed: false },
        { id: "s6", setNumber: 2, targetReps: 12, weight: null, actualReps: null, completed: false },
        { id: "s7", setNumber: 3, targetReps: 10, weight: null, actualReps: null, completed: false },
      ],
    },
    {
      id: "ex-3",
      name: "Cable Flyes",
      restSeconds: 60,
      sets: [
        { id: "s8", setNumber: 1, targetReps: 15, weight: null, actualReps: null, completed: false },
        { id: "s9", setNumber: 2, targetReps: 15, weight: null, actualReps: null, completed: false },
        { id: "s10", setNumber: 3, targetReps: 12, weight: null, actualReps: null, completed: false },
      ],
    },
    {
      id: "ex-4",
      name: "Overhead Tricep Extension",
      restSeconds: 60,
      sets: [
        { id: "s11", setNumber: 1, targetReps: 12, weight: null, actualReps: null, completed: false },
        { id: "s12", setNumber: 2, targetReps: 12, weight: null, actualReps: null, completed: false },
        { id: "s13", setNumber: 3, targetReps: 10, weight: null, actualReps: null, completed: false },
      ],
    },
    {
      id: "ex-5",
      name: "Lateral Raises",
      restSeconds: 45,
      sets: [
        { id: "s14", setNumber: 1, targetReps: 15, weight: null, actualReps: null, completed: false },
        { id: "s15", setNumber: 2, targetReps: 15, weight: null, actualReps: null, completed: false },
        { id: "s16", setNumber: 3, targetReps: 15, weight: null, actualReps: null, completed: false },
      ],
    },
  ],
};
