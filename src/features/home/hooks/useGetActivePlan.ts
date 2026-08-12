import { getCurrentUserId } from "@/src/lib/current-user";
import { getActivePlanIdForUser } from "@/src/lib/dao/preferences";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";

export default function useGetActivePlan() {
  const userId = getCurrentUserId();
  const [activePlanId, setActivePlanId] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      setActivePlanId(getActivePlanIdForUser(userId));
    }, [userId]),
  );

  return activePlanId;
}
