interface Workouts {
  id: number;
  workout_name: string;
  workout_image: string;
  sets: number;
  reps: string;
}

interface WorkoutDay {
  key: string;
  workouts: Workouts[];
}

interface CustomWorkoutPlan {
  day: string;
  key: string;
}

interface InitialWorkoutPlan {
  workoutPlan: WorkoutDay[];
}

export type { Workouts, WorkoutDay, InitialWorkoutPlan, CustomWorkoutPlan };
