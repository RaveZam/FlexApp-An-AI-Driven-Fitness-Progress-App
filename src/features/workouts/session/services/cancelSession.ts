import { enqueueOutbox } from "@/src/features/outbox";
import { updateSessionStatus } from "@/src/lib/dao/sessions";

// Marks a session cancelled locally, then queues the status change for Supabase.
export default function cancelSession(sessionId: string | null): void {
  if (!sessionId) return;
  const now = new Date().toISOString();
  updateSessionStatus(sessionId, "cancelled", now, now);
  enqueueOutbox({
    entityType: "workout_session",
    entityId: sessionId,
    operation: "update",
    payload: { status: "cancelled", completedAt: now },
  });
}
