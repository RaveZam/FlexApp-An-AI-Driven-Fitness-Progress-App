import { updateWorkoutDays } from "../services/workoutLocalService";

export function useUpdateWorkoutDays() {
  function saveDays(workoutId: string, daysOfWeek: number[]): void {
    updateWorkoutDays(workoutId, daysOfWeek);
  }

  return { saveDays };
}
