// Public entry point for the workouts feature. Other features import from here only.
import type { Workout, WorkoutSession } from "./types";

export { useActivePlan, useActiveSession } from "./context/ActivePlanContext";
export { useTodaysWorkouts } from "./plan/hooks/useTodaysWorkouts";
export type {
  SessionExercise,
  SessionSet,
  SessionStatus,
  Workout,
  WorkoutSession,
} from "./types";

// TODO(session-rebuild): the session hooks/services were removed for the full
// session reconstruction. These no-op stubs keep home/settings/history
// compiling until the rebuilt session feature provides real implementations.
export function useStartSession() {
  return {
    startSession: (_workout: Workout): string => "placeholder-session",
  };
}

export function getSessionById(_sessionId: string): WorkoutSession | null {
  return null;
}

export function deleteSession(_sessionId: string): void {}

export function deleteAllSessionsForUser(_userId: string): void {}

export function cancelAllInProgressForUser(_userId: string): void {}
