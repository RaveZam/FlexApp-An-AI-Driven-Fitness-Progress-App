// Local calendar-day key (YYYY-MM-DD), used to tell whether a stored
// preference was set "today" vs. a previous day, independent of timezone
// shifts baked into ISO/UTC timestamps.
export function getLocalDateKey(now: Date = new Date()): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
