export const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

export function getTodayLabel(date: Date = new Date()): string {
  return DAY_LABELS[date.getDay()];
}
