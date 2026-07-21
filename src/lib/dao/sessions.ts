import { getDb } from "@/src/lib/db";

export type SessionStatus = "in_progress" | "completed" | "cancelled";

export type SessionRow = {
  id: string | null;
  userId: string | null;
  workoutId: string;
  planId: string | null;
  name: string;
  status: SessionStatus;
  startedAt: string;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

type Raw = {
  id: string | null;
  user_id: string;
  workout_id: string;
  plan_id: string | null;
  name: string;
  status: string;
  started_at: string;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
};

const fromRaw = (r: Raw): SessionRow => ({
  id: r.id,
  userId: r.user_id,
  workoutId: r.workout_id,
  planId: r.plan_id,
  name: r.name,
  status: r.status as SessionStatus,
  startedAt: r.started_at,
  completedAt: r.completed_at,
  createdAt: r.created_at,
  updatedAt: r.updated_at,
});

export function getActiveSessionForUser(
  userId: string | null,
): SessionRow | null {
  if (!userId) return null;
  const row = getDb().getFirstSync<Raw>(
    "SELECT * FROM workout_sessions WHERE user_id = ? AND status = 'in_progress' ORDER BY started_at DESC LIMIT 1",
    [userId],
  );
  return row ? fromRaw(row) : null;
}

export function getSessionById(sessionId: string): SessionRow | null {
  const row = getDb().getFirstSync<Raw>(
    "SELECT * FROM workout_sessions WHERE id = ?",
    [sessionId],
  );
  return row ? fromRaw(row) : null;
}

// Sessions are attributed to the day they were started (i.e. which
// workout they belong to), not the day they happened to be marked
// completed — otherwise finishing yesterday's forgotten session today
// would make today look like it's already been worked out.
export function listCompletedSessionsInRange(
  userId: string,
  startISO: string,
  endISO: string,
): SessionRow[] {
  return getDb()
    .getAllSync<Raw>(
      `SELECT * FROM workout_sessions
       WHERE user_id = ? AND status = 'completed'
       AND started_at >= ? AND started_at < ?`,
      [userId, startISO, endISO],
    )
    .map(fromRaw);
}

export function listSessionIdsByUser(userId: string): string[] {
  return getDb()
    .getAllSync<{ id: string }>(
      "SELECT id FROM workout_sessions WHERE user_id = ?",
      [userId],
    )
    .map((r) => r.id);
}

export function listInProgressSessionIdsByUser(userId: string): string[] {
  return getDb()
    .getAllSync<{ id: string }>(
      "SELECT id FROM workout_sessions WHERE user_id = ? AND status = 'in_progress'",
      [userId],
    )
    .map((r) => r.id);
}

export function insertSession(row: SessionRow): void {
  getDb().runSync(
    `INSERT INTO workout_sessions
     (id, user_id, workout_id, plan_id, name, status, started_at, completed_at, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      row.id,
      row.userId,
      row.workoutId,
      row.planId,
      row.name,
      row.status,
      row.startedAt,
      row.completedAt,
      row.createdAt,
      row.updatedAt,
    ],
  );
}

export function updateSessionStatus(
  sessionId: string,
  status: SessionStatus,
  completedAt: string,
  updatedAt: string,
): void {
  getDb().runSync(
    "UPDATE workout_sessions SET status = ?, completed_at = ?, updated_at = ? WHERE id = ?",
    [status, completedAt, updatedAt, sessionId],
  );
}

export function cancelSession(sessionId: string): void {
  const now = new Date().toISOString();
  getDb().runSync(
    "UPDATE workout_sessions SET status = 'cancelled', completed_at = ?, updated_at = ? WHERE id = ?",
    [now, now, sessionId],
  );
}

export function deleteSession(sessionId: string): void {
  getDb().runSync("DELETE FROM workout_sessions WHERE id = ?", [sessionId]);
}

export function listAllSessions(): SessionRow[] {
  return getDb()
    .getAllSync<Raw>("SELECT * FROM workout_sessions ORDER BY created_at DESC")
    .map(fromRaw);
}
