import { enqueueOutbox } from "@/src/features/outbox";
import { updateSessionStatus } from "@/src/lib/dao/sessions";

// Marks a session completed locally, then queues the status change for Supabase.
export default function finishSession(sessionId: string | null): void {
  if (!sessionId) return;
  const now = new Date().toISOString();
  updateSessionStatus(sessionId, "completed", now, now);
  enqueueOutbox({
    entityType: "workout_session",
    entityId: sessionId,
    operation: "update",
    payload: { status: "completed", completedAt: now },
  });
}
