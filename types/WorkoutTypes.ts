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
  dayOfTheWeek: string;
}

interface CustomWorkoutPlan {
  day: string;
  key: string;
  dayOfTheWeek: string;
}

interface InitialWorkoutPlan {
  workoutPlan: WorkoutDay[];
}

export type { CustomWorkoutPlan, InitialWorkoutPlan, WorkoutDay, Workouts };
