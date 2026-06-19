import { enqueueOutbox } from "@/src/features/outbox";
import { deleteSessionExercisesBySession } from "@/src/lib/dao/sessionExercises";
import { deleteSession as deleteSessionRow } from "@/src/lib/dao/sessions";
import { deleteSessionSetsBySession } from "@/src/lib/dao/sessionSets";
import { getDb } from "@/src/lib/db";

// Removes a session and its child rows locally in one transaction, then queues
// a delete for Supabase. Sets are deleted first so no rows are orphaned if a
// later statement fails.

export default function deleteSession(sessionId: string): void {
  getDb().withTransactionSync(() => {
    deleteSessionSetsBySession(sessionId);
    deleteSessionExercisesBySession(sessionId);
    deleteSessionRow(sessionId);

    enqueueOutbox({
      entityType: "workout_session",
      entityId: sessionId,
      operation: "delete",
      payload: { sessionId },
    });
  });
}
