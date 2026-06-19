import { getActiveSessionForUser } from "@/src/lib/dao/sessions";
import { router } from "expo-router";
import { useAuth } from "../../auth";
import createSession from "../../workouts/session/services/createSession";

export function useHandleStartWorkout() {
  const { user } = useAuth();
  const activeSession = getActiveSessionForUser(user?.id ?? null);

  function handleStartWorkout() {
    if (activeSession) {
      console.log("Navigating to active session", activeSession.id);
      router.push(`/(tabs)/Workouts/session?id=${activeSession.id}` as any);
      return;
    } else {
      console.log("Creating new session");
      const sessionId = createSession(user?.id ?? null);
      if (sessionId) {
        console.log("Navigating to session", sessionId);
        router.push(`/(tabs)/Workouts/session?id=${sessionId}` as any);
      }
      return;
    }
  }

  return handleStartWorkout;
}
