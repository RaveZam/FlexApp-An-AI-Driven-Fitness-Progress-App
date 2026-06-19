import { listSessionExercisesBySession } from "@/src/lib/dao/sessionExercises";
import { getSessionById as getSessionRow } from "@/src/lib/dao/sessions";
import { listSessionSetsByExercise } from "@/src/lib/dao/sessionSets";
import type { WorkoutSession } from "../../types";

// Reassembles a stored session into the nested WorkoutSession the UI reads:
// the session row, its exercises (ordered by position), and each exercise's
// sets (ordered by set index). Returns null when the session doesn't exist.

export default function getSessionById(
  sessionId: string,
): WorkoutSession | null {
  const row = getSessionRow(sessionId);
  if (!row || !row.id) return null;

  const exercises = listSessionExercisesBySession(row.id).map((ex) => ({
    ...ex,
    sets: listSessionSetsByExercise(ex.id),
  }));

  return {
    id: row.id,
    userId: row.userId ?? "",
    workoutId: row.workoutId,
    planId: row.planId,
    name: row.name,
    status: row.status,
    startedAt: row.startedAt,
    completedAt: row.completedAt,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    exercises,
  };
}
