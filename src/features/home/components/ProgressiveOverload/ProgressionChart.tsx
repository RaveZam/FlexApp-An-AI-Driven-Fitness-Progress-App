import { usePalette, type Palette } from "@/src/theme";
import { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import ReAnimated, { FadeIn } from "react-native-reanimated";
import Svg, { Circle, Line, Polyline } from "react-native-svg";
import { computeProgressionChartLayout } from "../../core/progressionChartLayout";
import type { ExercisePoint } from "../../types/progressiveOverload";
import {
  BAR_GAP,
  BAR_WIDTH,
  CHART_HEIGHT,
  ProgressionBar,
} from "./ProgressionBar";

// Leave headroom inside the chart for the latest-session cap dot.
const BAR_MAX = CHART_HEIGHT - 8;
// Fixed frame sized for the max of 7 sessions, so the grid is constant.
const MAX_BARS = 7;
export const CHART_WIDTH = MAX_BARS * BAR_WIDTH + (MAX_BARS - 1) * BAR_GAP;
const GRID_ROWS = [0, 0.25, 0.5, 0.75];
const GRID_COLS = Array.from(
  { length: MAX_BARS },
  (_, i) => i * (BAR_WIDTH + BAR_GAP),
);

type Props = {
  points: ExercisePoint[];
  selectedIndex?: number | null;
  onSelectIndex?: (index: number) => void;
};

// Bars + grid + trend line for an exercise's progression. Non-interactive by
// default (ExerciseCard's compact readout); pass onSelectIndex to make bars
// tappable (ExerciseHistoryModal).
export function ProgressionChart({ points, selectedIndex, onSelectIndex }: Props) {
  const p = usePalette();
  const styles = useMemo(() => makeStyles(p), [p]);

  const { heights, coords, bestIndex, chartWidth } = computeProgressionChartLayout(
    points,
    { barWidth: BAR_WIDTH, barGap: BAR_GAP, barMax: BAR_MAX, chartHeight: CHART_HEIGHT },
  );

  return (
    <View style={styles.chartWrap}>
      <Svg width={CHART_WIDTH} height={CHART_HEIGHT} style={styles.grid}>
        {GRID_ROWS.map((f) => (
          <Line
            key={`r${f}`}
            x1={0}
            x2={CHART_WIDTH}
            y1={CHART_HEIGHT * f}
            y2={CHART_HEIGHT * f}
            stroke={p.hairline}
            strokeWidth={1}
          />
        ))}
        {GRID_COLS.map((x) => (
          <Line
            key={`c${x}`}
            x1={x}
            x2={x}
            y1={0}
            y2={CHART_HEIGHT}
            stroke={p.hairline}
            strokeWidth={1}
          />
        ))}
      </Svg>
      <View style={styles.baseline} />
      <View style={styles.chart}>
        {points.map((point, i) => (
          <ProgressionBar
            key={point.sessionId}
            index={i}
            heightPx={heights[i]}
            restingOpacity={0.42 + (i / Math.max(1, points.length - 1)) * 0.45}
            isBest={i === bestIndex}
            isLatest={i === points.length - 1}
            isSelected={selectedIndex === i}
            onPress={onSelectIndex ? () => onSelectIndex(i) : undefined}
          />
        ))}
      </View>

      {points.length > 1 && (
        <ReAnimated.View
          pointerEvents="none"
          entering={FadeIn.delay(140 + points.length * 55).duration(360)}
          style={[styles.trend, { width: chartWidth }]}
        >
          <Svg width={chartWidth} height={CHART_HEIGHT}>
            <Polyline
              points={coords.map((c) => `${c.x},${c.y}`).join(" ")}
              fill="none"
              stroke={p.accent}
              strokeWidth={1.25}
              strokeOpacity={0.7}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            {coords.map((c, i) => (
              <Circle
                key={i}
                cx={c.x}
                cy={c.y}
                r={i === bestIndex ? 2.2 : 1.4}
                fill={i === bestIndex ? p.accent : p.ink}
                stroke={p.accent}
                strokeWidth={i === bestIndex ? 0 : 1}
              />
            ))}
          </Svg>
        </ReAnimated.View>
      )}
    </View>
  );
}

const makeStyles = (p: Palette) =>
  StyleSheet.create({
    chartWrap: { position: "relative", justifyContent: "flex-end" },
    grid: { position: "absolute", left: 0, top: 0 },
    trend: { position: "absolute", left: 0, top: 0, height: CHART_HEIGHT },
    baseline: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      height: StyleSheet.hairlineWidth,
      backgroundColor: p.hairlineStrong,
    },
    chart: {
      flexDirection: "row",
      alignItems: "flex-end",
      width: CHART_WIDTH,
      height: CHART_HEIGHT,
      gap: BAR_GAP,
    },
  });
