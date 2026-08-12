import { getCurrentUserId } from "@/src/lib/current-user";
import { getActiveSessionForUser, type SessionRow } from "@/src/lib/dao/sessions";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";

export default function useGetActiveSession() {
  const userId = getCurrentUserId();
  const [activeSession, setActiveSession] = useState<SessionRow | null>(null);

  useFocusEffect(
    useCallback(() => {
      setActiveSession(getActiveSessionForUser(userId));
    }, [userId]),
  );

  return activeSession;
}
