import cancelSession from "../services/cancelSession";

export function cancelOngoingSession(activeSessionId: string | null): void {
  cancelSession(activeSessionId);
}
