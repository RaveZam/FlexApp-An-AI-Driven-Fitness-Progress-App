import { enqueueOutbox } from "@/src/features/outbox";
import {
  listSessionSetsByExercise,
  updateSessionSet,
} from "@/src/lib/dao/sessionSets";
import { getDb } from "@/src/lib/db";
import { currentSet } from "../core/sessionSetProgress";

type LogSetParams = {
  sessionExerciseId: string;
  weight: number | null;
  actualReps: number | null;
  actualRepsLeft: number | null;
  actualRepsRight: number | null;
};

// Upserts the entered weight/reps onto an exercise's first unlogged set: writes
// to SQLite and marks it complete in one transaction, then queues the set update
// for Supabase. Returns the set id written, or null when every set is logged.

export default function logSet({
  sessionExerciseId,
  weight,
  actualReps,
  actualRepsLeft,
  actualRepsRight,
}: LogSetParams): string | null {
  const sets = listSessionSetsByExercise(sessionExerciseId);
  const target = currentSet(sets);
  if (!target) return null;

  const completedAt = new Date().toISOString();

  getDb().withTransactionSync(() => {
    updateSessionSet({
      id: target.id,
      actualReps,
      actualRepsLeft,
      actualRepsRight,
      weight,
      completed: true,
      completedAt,
    });

    enqueueOutbox({
      entityType: "session_set",
      entityId: target.id,
      operation: "update",
      payload: {
        actualReps,
        actualRepsLeft,
        actualRepsRight,
        weight,
        completed: true,
        completedAt,
      },
    });
  });

  return target.id;
}
