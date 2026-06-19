import { getActivePlanIdForUser } from "@/src/lib/dao/preferences";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { useAuth } from "../../auth";

export default function useGetActivePlan() {
  const { user } = useAuth();
  const [activePlanId, setActivePlanId] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      setActivePlanId(user?.id ? getActivePlanIdForUser(user.id) : null);
    }, [user?.id]),
  );

  return activePlanId;
}
