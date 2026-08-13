import { getCurrentUserId } from "@/src/lib/current-user";
import { getActiveSessionForUser } from "@/src/lib/dao/sessions";
import { router } from "expo-router";
import { Alert } from "react-native";
import createSession from "../../workouts/session/services/createSession";
import { getTodayLabel } from "../helpers/dayLabels";

export function useStartWorkout(workoutName?: string) {
  const userId = getCurrentUserId();
  const activeSession = getActiveSessionForUser(userId);

  //Creates a fresh session and routes to workoutscreen
  function beginSession() {
    const sessionId = createSession(userId);
    if (sessionId) {
      router.push(`/(tabs)/Workouts/session?id=${sessionId}` as any);
    }
  }
  // Either start with a active session, gotten from querying ongoing workout, or begin a fresh session
  function startWorkout() {
    if (activeSession) {
      router.push(`/(tabs)/Workouts/session?id=${activeSession.id}` as any);
      return;
    }
    const message = workoutName
      ? `Ready to start ${workoutName} — ${getTodayLabel()}?`
      : "Ready to start your workout?";
    Alert.alert("Start Workout", message, [
      { text: "Cancel", style: "cancel" },
      { text: "Start", onPress: beginSession },
    ]);
  }

  return startWorkout;
}
