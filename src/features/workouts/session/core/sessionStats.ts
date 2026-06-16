export function calculateSessionStats(
  recentSessions: any[],
  selectedBarIndex: number | null,
) {
  const maxChartVolume = recentSessions.reduce(
    (m: number, p: any) => Math.max(m, p?.maxWeight * Math.max(1, p.repsAtMax)),
    0,
  );
  const selectedSession =
    selectedBarIndex !== null
      ? (recentSessions[selectedBarIndex] ?? null)
      : null;

  return {
    maxChartVolume,
    selectedSession,
  };
}
