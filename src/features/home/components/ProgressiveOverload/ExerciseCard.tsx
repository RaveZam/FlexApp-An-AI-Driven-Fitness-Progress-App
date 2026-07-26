import { FontFamilies } from "@/constants/theme";
import { usePalette, type Palette } from "@/src/theme";
import { Feather } from "@expo/vector-icons";
import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import ReAnimated, { FadeIn, FadeInDown } from "react-native-reanimated";
import Svg, { Circle, Line, Polyline } from "react-native-svg";
import type { ExerciseProgress } from "../../types/progressiveOverload";
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
const CHART_WIDTH = MAX_BARS * BAR_WIDTH + (MAX_BARS - 1) * BAR_GAP;
const GRID_ROWS = [0, 0.25, 0.5, 0.75];
const GRID_COLS = Array.from(
  { length: MAX_BARS },
  (_, i) => i * (BAR_WIDTH + BAR_GAP),
);

type Props = {
  exercise: ExerciseProgress;
  delay: number;
};

export function ExerciseCard({ exercise, delay }: Props) {
  const p = usePalette();
  const styles = useMemo(() => makeStyles(p), [p]);
  const { points } = exercise;
  const latest = points[points.length - 1];
  const volumes = points.map((p) => p.weight * p.reps);
  const maxVolume = Math.max(...volumes, 0);
  const bestIndex = volumes.indexOf(maxVolume);

  const first = volumes[0] ?? 0;
  const last = volumes[volumes.length - 1] ?? 0;
  const deltaPct =
    points.length > 1 && first > 0
      ? Math.round(((last - first) / first) * 100)
      : null;

  const heights = volumes.map((v) =>
    maxVolume > 0 ? Math.max(3, (v / maxVolume) * BAR_MAX) : 3,
  );
  // Bar-top coordinates, used to thread the trend line through the chart.
  const coords = heights.map((h, i) => ({
    x: i * (BAR_WIDTH + BAR_GAP) + BAR_WIDTH / 2,
    y: CHART_HEIGHT - h,
  }));
  const chartWidth =
    points.length * BAR_WIDTH + Math.max(0, points.length - 1) * BAR_GAP;

  console.log(exercise);

  if (points.some((p) => p.reps === 0)) {
    return null;
  }

  return (
    <ReAnimated.View
      entering={FadeInDown.delay(delay).duration(420)}
      style={styles.card}
    >
      <View style={styles.info}>
        <View style={styles.infoHead}>
          <Text style={styles.exerciseName} numberOfLines={1}>
            {exercise.name}
          </Text>
          <DeltaChip deltaPct={deltaPct} />
        </View>

        {latest && (
          <View style={styles.readout}>
            <Text style={styles.weight}>{latest.weight}</Text>
            <Text style={styles.unit}>lb</Text>
            <Text style={styles.reps}>× {latest.reps}</Text>
          </View>
        )}
      </View>

      <View style={styles.divider} />

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
              restingOpacity={
                0.42 + (i / Math.max(1, points.length - 1)) * 0.45
              }
              isBest={i === bestIndex}
              isLatest={i === points.length - 1}
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
    </ReAnimated.View>
  );
}

function DeltaChip({ deltaPct }: { deltaPct: number | null }) {
  const p = usePalette();
  const styles = useMemo(() => makeStyles(p), [p]);
  if (deltaPct === null) {
    return (
      <View style={[styles.chip, styles.chipNeutral]}>
        <Text style={styles.chipTextNeutral}>NEW</Text>
      </View>
    );
  }
  const up = deltaPct >= 0;
  const color = up ? p.accent : p.danger;
  return (
    <View
      style={[
        styles.chip,
        // No "dangerSoft" fill token exists — nearest fit is dangerBorder, reused
        // here as the down-trend chip fill (mirrors the up-trend accentSoft usage).
        { backgroundColor: up ? p.accentSoft : p.dangerBorder },
      ]}
    >
      <Feather
        name={up ? "trending-up" : "trending-down"}
        size={10}
        color={color}
      />
      <Text style={[styles.chipText, { color }]}>
        {up ? "+" : "−"}
        {Math.abs(deltaPct)}%
      </Text>
    </View>
  );
}

const makeStyles = (p: Palette) =>
  StyleSheet.create({
    card: {
      flexDirection: "row",
      alignItems: "center",
      borderRadius: 14,
      backgroundColor: "rgba(245,243,239,0.035)",
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: p.hairline,
      paddingVertical: 13,
      paddingHorizontal: 15,
      gap: 15,
      overflow: "hidden",
    },
    info: { flex: 1, gap: 9 },
    infoHead: { flexDirection: "row", alignItems: "center", gap: 8 },
    exerciseName: {
      flex: 1,
      color: p.bone,
      fontSize: 13,
      fontFamily: FontFamilies.semibold,
      letterSpacing: 0.1,
    },
    readout: { flexDirection: "row", alignItems: "baseline", gap: 5 },
    divider: {
      alignSelf: "stretch",
      width: StyleSheet.hairlineWidth,
      marginVertical: 2,
      backgroundColor: p.hairline,
    },
    weight: {
      color: p.bone,
      fontSize: 20,
      fontFamily: FontFamilies.semibold,
      letterSpacing: -0.4,
      fontVariant: ["tabular-nums"],
    },
    unit: {
      color: p.muted,
      fontSize: 10,
      fontFamily: FontFamilies.displayRegular,
      letterSpacing: 0.4,
    },
    reps: {
      color: p.accent,
      fontSize: 11,
      fontFamily: FontFamilies.medium,
      fontVariant: ["tabular-nums"],
    },
    chip: {
      flexDirection: "row",
      alignItems: "center",
      gap: 3,
      paddingVertical: 2,
      paddingHorizontal: 6,
      borderRadius: 999,
    },
    chipNeutral: { backgroundColor: p.hairline },
    chipText: {
      fontSize: 10,
      fontFamily: FontFamilies.semibold,
      letterSpacing: 0.2,
      fontVariant: ["tabular-nums"],
    },
    chipTextNeutral: {
      color: p.muted,
      fontSize: 9,
      fontFamily: FontFamilies.semibold,
      letterSpacing: 1.5,
    },
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
