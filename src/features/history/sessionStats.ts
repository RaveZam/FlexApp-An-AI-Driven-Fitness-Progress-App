import type { WorkoutSessionSummary } from "./types";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export type MonthSection = {
  title: string;
  year: number;
  volume: number;
  data: WorkoutSessionSummary[];
};

export type WeekLoad = { key: string; volume: number; sessions: number };

export type OverviewStats = {
  total: number;
  thisWeek: number;
  monthVolume: number;
  streak: number;
};

export function formatDuration(startedAt: string, completedAt: string): string {
  const ms = new Date(completedAt).getTime() - new Date(startedAt).getTime();
  const totalMin = Math.round(ms / 60000);
  if (totalMin < 60) return `${totalMin}m`;
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

const DAY_ABBR = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

/** "MON 24 · 6:40 PM" — the entry's dateline on the spine. */
export function formatStamp(iso: string): string {
  const d = new Date(iso);
  const hour24 = d.getHours();
  const hour = hour24 % 12 === 0 ? 12 : hour24 % 12;
  const minute = String(d.getMinutes()).padStart(2, "0");
  const meridiem = hour24 < 12 ? "AM" : "PM";
  return `${DAY_ABBR[d.getDay()]} ${d.getDate()} · ${hour}:${minute} ${meridiem}`;
}

export function formatVolume(lb: number): string {
  if (lb <= 0) return "—";
  if (lb < 1000) return `${Math.round(lb)}`;
  const k = lb / 1000;
  return `${k >= 10 ? Math.round(k) : k.toFixed(1).replace(/\.0$/, "")}k`;
}

function dayKey(d: Date): string {
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

// Consecutive calendar days ending today (one grace day for "yesterday").
export function computeDayStreak(dates: Date[]): number {
  const keys = new Set(dates.map(dayKey));
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);
  if (!keys.has(dayKey(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
    if (!keys.has(dayKey(cursor))) return 0;
  }
  let streak = 0;
  while (keys.has(dayKey(cursor))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export function computeOverviewStats(sessions: WorkoutSessionSummary[]): OverviewStats {
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setHours(0, 0, 0, 0);
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  let thisWeek = 0;
  let monthVolume = 0;
  for (const s of sessions) {
    const d = new Date(s.completedAt);
    if (d >= weekStart) thisWeek++;
    if (d >= monthStart) monthVolume += s.volume;
  }
  const streak = computeDayStreak(sessions.map((s) => new Date(s.completedAt)));
  return { total: sessions.length, thisWeek, monthVolume, streak };
}

export function groupByMonth(sessions: WorkoutSessionSummary[]): MonthSection[] {
  const map = new Map<string, MonthSection>();
  for (const s of sessions) {
    const d = new Date(s.completedAt);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    const section =
      map.get(key) ??
      { title: MONTH_NAMES[d.getMonth()], year: d.getFullYear(), volume: 0, data: [] };
    section.volume += s.volume;
    section.data.push(s);
    map.set(key, section);
  }
  return Array.from(map.values());
}

/**
 * Volume expressed as a rung of the load ladder (0 faintest … 4 brightest),
 * scaled against the heaviest entry in view. The top rungs stay earned: only
 * the heaviest fifth of the log reaches lime.
 */
export function loadRung(volume: number, peak: number): number {
  if (volume <= 0 || peak <= 0) return 0;
  return Math.min(4, Math.floor((volume / peak) * 5));
}

export function peakVolume(sessions: WorkoutSessionSummary[]): number {
  let peak = 0;
  for (const s of sessions) if (s.volume > peak) peak = s.volume;
  return peak;
}

/** Volume per calendar week, oldest first, for the `weeks` weeks ending this one. */
export function weeklyLoad(
  sessions: WorkoutSessionSummary[],
  weeks: number,
): WeekLoad[] {
  const firstWeek = new Date();
  firstWeek.setHours(0, 0, 0, 0);
  firstWeek.setDate(firstWeek.getDate() - firstWeek.getDay() - (weeks - 1) * 7);

  const buckets: WeekLoad[] = Array.from({ length: weeks }, (_, i) => ({
    key: String(i),
    volume: 0,
    sessions: 0,
  }));

  for (const s of sessions) {
    const d = new Date(s.completedAt);
    d.setHours(0, 0, 0, 0);
    // Round the day gap so a DST shift can't drop an entry into the week before.
    const days = Math.round((d.getTime() - firstWeek.getTime()) / 86400000);
    const index = Math.floor(days / 7);
    if (index < 0 || index >= weeks) continue;
    buckets[index].volume += s.volume;
    buckets[index].sessions += 1;
  }
  return buckets;
}
