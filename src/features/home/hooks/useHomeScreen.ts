import { deriveStartButton } from "@/src/features/home/helpers/startButton";
import {
  useActivePlan,
  useActiveSession,
  useStartSession,
  useTodaysWorkouts,
  type Workout,
} from "@/src/features/workouts";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

export function useHomeScreen() {
  const { activePlanId } = useActivePlan();
  const { workouts: todaysWorkouts } = useTodaysWorkouts();
  const { activeSession, refresh: refreshActiveSession } = useActiveSession();
  const { startSession } = useStartSession();

  const [multiPickerVisible, setMultiPickerVisible] = useState(false);

  // Re-read the active session from local storage whenever Home regains focus
  // (e.g. after finishing/cancelling a workout in the session screen).
  useFocusEffect(
    useCallback(() => {
      refreshActiveSession();
    }, [refreshActiveSession]),
  );

  const hasActiveSession = !!activeSession;
  const hasNoActivePlan = !activePlanId;
  const isRestDay = !!activePlanId && todaysWorkouts.length === 0;

  const { label: buttonLabel, disabled: buttonDisabled } = deriveStartButton({
    hasActiveSession,
    isRestDay,
    hasNoActivePlan,
  });

  function handlePickWorkout(workout: Workout) {
    setMultiPickerVisible(false);
    const sessionId = startSession(workout);
    router.push(`/(tabs)/Workouts/session?id=${sessionId}` as any);
  }

  function closeMultiPicker() {
    setMultiPickerVisible(false);
  }

  return {
    activePlanId,
    todaysWorkouts,
    hasActiveSession,
    multiPickerVisible,
    closeMultiPicker,

    handlePickWorkout,
    buttonLabel,
    buttonDisabled,
  };
}
