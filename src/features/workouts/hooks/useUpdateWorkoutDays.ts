import { enqueueOutbox } from "../services/outboxService";
import { updateWorkoutDays } from "../services/workoutLocalService";

export function useUpdateWorkoutDays() {
  function saveDays(workoutId: string, daysOfWeek: number[]): void {
    const now = new Date().toISOString();
    updateWorkoutDays(workoutId, daysOfWeek);
    enqueueOutbox({
      entityType: "workout_days",
      entityId: workoutId,
      operation: "update",
      payload: {
        workout_id: workoutId,
        days: daysOfWeek,
        updated_at: now,
      },
    });
  }

  return { saveDays };
}
