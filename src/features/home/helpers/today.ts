// Pure date helpers — no React, no DB. Compute the local calendar day so we can
// ask "did anything happen *today*?" against ISO timestamps stored in UTC.

export type DayRange = { startISO: string; endISO: string };

// Returns the [start, end) ISO bounds of the local day that `now` falls in.
// completed_at is stored via Date.toISOString() (UTC), so comparing against
// these UTC bounds correctly maps a row back to the user's local calendar day.
export function getTodayRange(now: Date = new Date()): DayRange {
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const end = new Date(start);
  end.setDate(start.getDate() + 1);
  return { startISO: start.toISOString(), endISO: end.toISOString() };
}
