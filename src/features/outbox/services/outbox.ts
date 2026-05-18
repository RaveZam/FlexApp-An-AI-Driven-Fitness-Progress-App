import { getDb } from "@/src/lib/db";
import { generateUUID } from "@/src/lib/uuid";

type OutboxOperation = "create" | "update" | "delete";

export function enqueueOutbox(params: {
  entityType: string;
  entityId: string;
  operation: OutboxOperation;
  payload: object;
}): void {
  const db = getDb();
  db.runSync(
    `INSERT INTO outbox (id, entity_type, entity_id, operation, payload, created_at, synced_at)
     VALUES (?, ?, ?, ?, ?, ?, NULL)`,
    [
      generateUUID(),
      params.entityType,
      params.entityId,
      params.operation,
      JSON.stringify(params.payload),
      new Date().toISOString(),
    ]
  );
}
