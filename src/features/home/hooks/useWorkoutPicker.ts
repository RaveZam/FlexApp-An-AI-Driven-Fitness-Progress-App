import type { Workout } from "@/src/features/workouts";
import { usePlans } from "@/src/features/workouts/plan/hooks/usePlans";
import { getCurrentUserId } from "@/src/lib/current-user";
import { upsertActiveWorkoutForUser } from "@/src/lib/dao/preferences";
import { getLocalDateKey } from "@/src/lib/date";
import { useState } from "react";
import useGetActivePlan from "./useGetActivePlan";

export function useWorkoutPicker(onPicked?: () => void) {
  const userId = getCurrentUserId();
  const activePlanId = useGetActivePlan();
  const { plans } = usePlans();
  const [visible, setVisible] = useState(false);

  //This is the workout days from the active plan ID, later on displayed in the picker modal
  const workouts: Workout[] =
    plans.find((p) => p.id === activePlanId)?.workouts ?? [];

  function open() {
    setVisible(true);
  }

  function close() {
    setVisible(false);
  }

  //Takes the picked workout gotten from the the picker modal, and upsert the that workout id with a date key
  function pickWorkout(workout: Workout) {
    if (userId) {
      upsertActiveWorkoutForUser(
        userId,
        workout.id,
        getLocalDateKey(),
        new Date().toISOString(),
      );
    }
    close();
    onPicked?.();
  }

  return { visible, open, close, workouts, pickWorkout };
}
