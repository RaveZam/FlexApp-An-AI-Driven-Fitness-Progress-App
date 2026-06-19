import { getActiveSessionForUser, type SessionRow } from "@/src/lib/dao/sessions";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { useAuth } from "../../auth";

export default function useGetActiveSession() {
  const { user } = useAuth();
  const [activeSession, setActiveSession] = useState<SessionRow | null>(null);

  useFocusEffect(
    useCallback(() => {
      setActiveSession(getActiveSessionForUser(user?.id || null));
    }, [user?.id]),
  );

  return activeSession;
}
