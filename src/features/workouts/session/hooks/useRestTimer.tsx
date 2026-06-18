import { useAuth } from "@/src/features/auth/hooks/useAuth";
import { getRestTimerSecondsForUser } from "@/src/lib/dao/preferences";
import { useEffect, useState } from "react";

// Holds the user's configured rest interval (in seconds). Reads from local
// preferences and re-reads whenever the user changes. Safe to call in multiple
// places — the underlying DAO read is a cheap synchronous SQLite lookup.
export default function useRestTimer(): number {
  const { userId } = useAuth();
  const [restSeconds, setRestSeconds] = useState(() =>
    getRestTimerSecondsForUser(userId),
  );

  useEffect(() => {
    setRestSeconds(getRestTimerSecondsForUser(userId));
  }, [userId]);

  return restSeconds;
}
