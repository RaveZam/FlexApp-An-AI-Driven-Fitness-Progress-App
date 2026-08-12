import { getWeekRange } from "@/src/features/home/helpers/weekDates";
import { useActivePlan } from "@/src/features/workouts";
import { getCurrentUserId } from "@/src/lib/current-user";
import { listCompletedSessionsInRange } from "@/src/lib/dao/sessions";
import { listWorkoutDaysByWorkoutIds as listDaysByWorkoutIds } from "@/src/lib/dao/workoutDays";
import { listWorkoutsByPlan } from "@/src/lib/dao/workouts";
import { useMemo } from "react";

export function useScheduleBar() {
  const { activePlanId } = useActivePlan();
  const userId = getCurrentUserId();

  const plannedDays = useMemo<Set<number>>(() => {
    if (!activePlanId) return new Set();
    const workouts = listWorkoutsByPlan(activePlanId);
    if (workouts.length === 0) return new Set();
    const dayMap = listDaysByWorkoutIds(workouts.map((w) => w.id));
    const set = new Set<number>();
    for (const days of dayMap.values()) {
      for (const d of days) set.add(d);
    }
    return set;
  }, [activePlanId]);

  const completedDays = useMemo<Set<number>>(() => {
    const { start, end } = getWeekRange(new Date());
    const sessions = listCompletedSessionsInRange(userId, start.toISOString(), end.toISOString());
    const set = new Set<number>();
    for (const s of sessions) {
      set.add(new Date(s.startedAt).getDay());
    }
    return set;
  }, [userId]);

  return { plannedDays, completedDays };
}
