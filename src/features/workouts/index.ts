// Public entry point for the workouts feature. Other features import from here only.
export { useActivePlan } from "./context/ActivePlanContext";
export { useTodaysWorkouts } from "./plan/hooks/useTodaysWorkouts";
export { default as getSessionById } from "./session/services/getSessionById";
export { default as deleteSession } from "./session/services/deleteSession";
export type {
  SessionExercise,
  SessionSet,
  SessionStatus,
  Workout,
  WorkoutSession,
} from "./types";

// TODO(session-rebuild): the remaining stubs below keep settings
// compiling until the rebuilt session feature provides real implementations.
export function deleteAllSessionsForUser(_userId: string): void {}

export function cancelAllInProgressForUser(_userId: string): void {}
