import { useContext } from "react";
import { SessionContext } from "../context/WorkoutSessionProvider";

export function useWorkoutSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) {
    throw new Error("useWorkoutSession must be used within a WorkoutSessionProvider");
  }
  return ctx;
}
