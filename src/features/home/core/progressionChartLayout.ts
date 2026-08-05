import type { ExercisePoint } from "@/src/features/home/types/progressiveOverload";

export type BarCoord = { x: number; y: number };

export type ProgressionChartLayout = {
  heights: number[];
  coords: BarCoord[];
  bestIndex: number;
  chartWidth: number;
};

export type ProgressionChartLayoutConfig = {
  barWidth: number;
  barGap: number;
  barMax: number;
  chartHeight: number;
};

// Turns raw session points into bar heights, trend-line coordinates, and the
// index of the best (highest-volume) session, given the chart's pixel geometry.
export function computeProgressionChartLayout(
  points: ExercisePoint[],
  config: ProgressionChartLayoutConfig,
): ProgressionChartLayout {
  const volumes = points.map((pt) => pt.weight * pt.reps);
  const maxVolume = Math.max(...volumes, 0);
  const bestIndex = volumes.indexOf(maxVolume);

  const heights = volumes.map((v) =>
    maxVolume > 0 ? Math.max(3, (v / maxVolume) * config.barMax) : 3,
  );
  const coords = heights.map((h, i) => ({
    x: i * (config.barWidth + config.barGap) + config.barWidth / 2,
    y: config.chartHeight - h,
  }));
  const chartWidth =
    points.length * config.barWidth + Math.max(0, points.length - 1) * config.barGap;

  return { heights, coords, bestIndex, chartWidth };
}
