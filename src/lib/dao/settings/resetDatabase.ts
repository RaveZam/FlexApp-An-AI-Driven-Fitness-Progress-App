import { getDb } from "@/src/lib/db";

/**
 * Deletes every row from every table in the local SQLite database, leaving the
 * schema intact. Used on sign-out so the next user (or the next sign-in of the
 * same user) starts from a clean slate rather than seeing stale local data
 * before the download sync runs.
 */
export function wipeLocalDb(): void {
  const db = getDb();
  const tables = db.getAllSync<{ name: string }>(
    "SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%'",
  );
  db.withTransactionSync(() => {
    for (const { name } of tables) {
      db.runSync(`DELETE FROM "${name}"`);
    }
  });
}
