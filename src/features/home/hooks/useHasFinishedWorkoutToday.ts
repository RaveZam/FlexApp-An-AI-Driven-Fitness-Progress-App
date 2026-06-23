import { listCompletedSessionsInRange } from "@/src/lib/dao/sessions";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { useAuth } from "../../auth";
import { getTodayRange } from "../helpers/today";

// True when the user has at least one session completed within today's local day.
// Re-reads on focus so the Home button updates after finishing a workout.
export default function useHasFinishedWorkoutToday() {
  const { user } = useAuth();
  const [finishedToday, setFinishedToday] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (!user?.id) {
        setFinishedToday(false);
        return;
      }
      const { startISO, endISO } = getTodayRange();
      const completed = listCompletedSessionsInRange(user.id, startISO, endISO);
      setFinishedToday(completed.length > 0);
    }, [user?.id]),
  );

  return finishedToday;
}
