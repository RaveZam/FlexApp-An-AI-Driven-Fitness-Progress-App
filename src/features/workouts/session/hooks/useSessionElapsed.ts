import { getElapsedSeconds } from "@/src/features/workouts/session/core/sessionElapsed";
import { getSessionById } from "@/src/features/workouts/session/services/sessionLocalService";
import { useEffect, useState } from "react";

export function useSessionElapsed(sessionId: string | undefined) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    const startedAt = sessionId ? getSessionById(sessionId)?.startedAt ?? null : null;
    setElapsedSeconds(getElapsedSeconds(startedAt));
    if (!startedAt) return;

    const interval = setInterval(
      () => setElapsedSeconds(getElapsedSeconds(startedAt)),
      1000
    );
    return () => clearInterval(interval);
  }, [sessionId]);

  return { elapsedSeconds };
}
