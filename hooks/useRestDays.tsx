import { useState } from "react";
import { useWorkoutContext } from "./useWorkoutPlanContext";

export const useRestDays = () => {
  const { workoutNumberOfDays, restDays, setRestDays } = useWorkoutContext();

  const toggleRestDay = (day: string) => {
    if (7 - workoutNumberOfDays > restDays.length) {
      setRestDays((prev) => [...prev, day]);
    }
    if (restDays.includes(day)) {
      setRestDays((prev) => prev.filter((d) => d !== day));
    }
  };
  return { restDays, setRestDays, toggleRestDay };
};
