import { getActiveSessionForUser } from "@/src/lib/dao/sessions";
import { router } from "expo-router";
import { useAuth } from "../../auth";
import createSession from "../../workouts/session/services/createSession";

export function useHandleStartWorkout() {
  const { user } = useAuth();
  const activeSession = getActiveSessionForUser(user?.id ?? null);

  function handleStartWorkout() {
    if (activeSession) {
      router.push(`/(tabs)/Workouts/session?id=${activeSession.id}` as any);
      return;
    }
    const sessionId = createSession(user?.id ?? null);
    if (sessionId) {
      router.push(`/(tabs)/Workouts/session?id=${sessionId}` as any);
    }
  }

  return handleStartWorkout;
}
