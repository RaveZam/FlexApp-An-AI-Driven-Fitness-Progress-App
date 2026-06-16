import type { ExerciseSessionPoint } from "../sessionView";

export type SessionBar = {
  point: ExerciseSessionPoint;
  heightPx: number;
  restingOpacity: number;
};

const CHART_HEIGHT_PX = 56;
const MIN_BAR_PX = 4;

export function buildSessionBars(
  sessions: ExerciseSessionPoint[],
): SessionBar[] {
  const maxVolume = sessions.reduce(
    (max, p) => Math.max(max, p.maxWeight * Math.max(1, p.repsAtMax)),
    0,
  );

  return sessions.map((point, i) => {
    const volume = point.maxWeight * Math.max(1, point.repsAtMax);
    return {
      point,
      heightPx:
        maxVolume > 0
          ? Math.max(MIN_BAR_PX, (volume / maxVolume) * CHART_HEIGHT_PX)
          : MIN_BAR_PX,
      restingOpacity: 0.55 + (i / Math.max(1, sessions.length - 1)) * 0.4,
    };
  });
}
