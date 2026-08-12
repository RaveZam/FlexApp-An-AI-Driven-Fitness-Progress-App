import { getCurrentUserId } from "@/src/lib/current-user";
import { listCompletedSessionsInRange } from "@/src/lib/dao/sessions";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { getTodayRange } from "../helpers/today";

// True when the user has at least one session completed within today's local day.
// Re-reads on focus so the Home button updates after finishing a workout.
export default function useHasFinishedWorkoutToday() {
  const userId = getCurrentUserId();
  const [finishedToday, setFinishedToday] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const { startISO, endISO } = getTodayRange();
      const completed = listCompletedSessionsInRange(userId, startISO, endISO);
      setFinishedToday(completed.length > 0);
    }, [userId]),
  );

  return finishedToday;
}
