import { getActivePlanIdForUser } from "@/src/lib/dao/preferences";
import { listWorkoutExercisesByWorkout, WorkoutExerciseRow } from "@/src/lib/dao/workoutExercises";
import { getWorkoutIDForDay } from "@/src/lib/dao/workouts";

export function getCurrentWorkoutExercises(userId: string, day : number): WorkoutExerciseRow[] {

  const planId = getActivePlanIdForUser(userId);
  if (!planId) return [];                  // no active plan → empty

  const todaysWorkoutId = getWorkoutIDForDay(planId, day);
  if (!todaysWorkoutId) return [];           // nothing scheduled today

  return listWorkoutExercisesByWorkout(todaysWorkoutId);
}
