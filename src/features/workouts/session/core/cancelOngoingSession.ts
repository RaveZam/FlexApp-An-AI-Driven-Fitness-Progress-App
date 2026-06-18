import { cancelSession } from "@/src/lib/dao/sessions";

export function cancelOngoingSession(activeSessionId: string | null): void {
  if (!activeSessionId) return;
  cancelSession(activeSessionId);
}
