import type { WorkoutSessionSummary } from "./types";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export type MonthSection = { title: string; data: WorkoutSessionSummary[] };

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
  const map = new Map<string, WorkoutSessionSummary[]>();
  for (const s of sessions) {
    const d = new Date(s.completedAt);
    const key = `${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(s);
  }
  return Array.from(map.entries()).map(([title, data]) => ({ title, data }));
}
