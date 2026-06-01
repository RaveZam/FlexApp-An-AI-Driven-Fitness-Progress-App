import { useAuth } from "@/src/features/auth/hooks/useAuth";
import { deriveStartButton } from "@/src/features/home/helpers/startButton";
import { useActivePlan } from "@/src/features/workouts/hooks/useActivePlan";
import { useActiveSession } from "@/src/features/workouts/hooks/useActiveSession";
import { useStartSession } from "@/src/features/workouts/hooks/useStartSession";
import { useTodaysWorkouts } from "@/src/features/workouts/hooks/useTodaysWorkouts";
import type { Workout } from "@/src/features/workouts/types";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";

export function useHomeScreen() {
  const { session } = useAuth();
  const { activePlanId } = useActivePlan();
  const { workouts: todaysWorkouts } = useTodaysWorkouts();
  const { activeSession, refresh: refreshActiveSession } = useActiveSession();
  const { startSession } = useStartSession();

  const [multiPickerVisible, setMultiPickerVisible] = useState(false);

  useEffect(() => {
    if (!session) router.replace("/login");
  }, [session]);

  // Re-read the active session from local storage whenever Home regains focus
  // (e.g. after finishing/cancelling a workout in the session screen).
  useFocusEffect(
    useCallback(() => {
      refreshActiveSession();
    }, [refreshActiveSession])
  );

  const hasActiveSession = !!activeSession;
  const hasNoActivePlan = !activePlanId;
  const isRestDay = !!activePlanId && todaysWorkouts.length === 0;

  const { label: buttonLabel, disabled: buttonDisabled } = deriveStartButton({
    hasActiveSession,
    isRestDay,
    hasNoActivePlan,
  });

   function handleStartWorkout() {
    if (hasActiveSession) {
      router.push(`/(tabs)/Workouts/session?id=${activeSession.id}` as any);
      console.log("1")
      return;
    }
    if (todaysWorkouts.length === 1) {
      const sessionId =  startSession(todaysWorkouts[0]);
      console.log("Session ID:", sessionId);
      router.push(`/(tabs)/Workouts/session?id=${sessionId}` as any);
      console.log("Session ID2:", sessionId);
       console.log("2")
      return;
    }
    if (todaysWorkouts.length > 1) {
      setMultiPickerVisible(true);
    }
  }

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
    handleStartWorkout,
    handlePickWorkout,
    buttonLabel,
    buttonDisabled,
  };
}
