import { FontFamilies } from "@/constants/theme";
import { usePalette, type Palette } from "@/src/theme";
import { Feather } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { LayoutChangeEvent, StyleSheet, Text, View } from "react-native";
import Svg, {
  Circle,
  Defs,
  Line,
  LinearGradient,
  Polygon,
  Polyline,
  Stop,
} from "react-native-svg";
import { estimateOneRepMax } from "../core/estimateOneRepMax";
import type { ExerciseSessionPoint } from "../types";

const CHART_HEIGHT = 168;
const CHART_PAD_TOP = 14;
const GRID_ROWS = [0, 0.25, 0.5, 0.75, 1];

type Props = {
  points: ExerciseSessionPoint[];
};

export function StrengthCurve({ points }: Props) {
  const p = usePalette();
  const styles = useMemo(() => makeStyles(p), [p]);
  const [width, setWidth] = useState(0);

  const onLayout = (e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width);

  const e1rms = points.map((p) => estimateOneRepMax(p.maxWeight, p.repsAtMax));
  const latest = e1rms[e1rms.length - 1] ?? 0;
  const first = e1rms[0] ?? 0;
  const deltaPct = e1rms.length > 1 && first > 0 ? Math.round(((latest - first) / first) * 100) : null;
  const up = (deltaPct ?? 0) >= 0;

  const usableHeight = CHART_HEIGHT - CHART_PAD_TOP;
  const maxVal = Math.max(...e1rms, 1) * 1.08;

  const step = points.length > 1 ? width / (points.length - 1) : 0;
  const curveCoords = e1rms.map((v, i) => ({
    x: points.length > 1 ? i * step : width / 2,
    y: CHART_PAD_TOP + usableHeight - (v / maxVal) * usableHeight,
  }));
  const dotCoords = points.map((p, i) => ({
    x: curveCoords[i]?.x ?? 0,
    y: CHART_PAD_TOP + usableHeight - (p.maxWeight / maxVal) * usableHeight,
  }));

  const linePoints = curveCoords.map((c) => `${c.x},${c.y}`).join(" ");
  const areaPoints =
    curveCoords.length > 0
      ? `0,${CHART_HEIGHT} ${linePoints} ${width},${CHART_HEIGHT}`
      : "";

  return (
    <View style={styles.card}>
      <View style={styles.readoutRow}>
        <View>
          <Text style={styles.eyebrow}>Est. 1RM</Text>
          <View style={styles.valueRow}>
            <Text style={styles.value}>{latest}</Text>
            <Text style={styles.unit}>lb</Text>
          </View>
        </View>

        {deltaPct !== null && (
          <View
            style={[
              styles.chip,
              { backgroundColor: up ? p.accentSoft : p.dangerSoft },
            ]}
          >
            <Feather
              name={up ? "trending-up" : "trending-down"}
              size={11}
              color={up ? p.accent : p.danger}
            />
            <Text style={[styles.chipText, { color: up ? p.accent : p.danger }]}>
              {up ? "+" : "−"}
              {Math.abs(deltaPct)}%
            </Text>
          </View>
        )}
      </View>

      <View style={styles.chartWrap} onLayout={onLayout}>
        {width > 0 && (
          <>
            <Svg width={width} height={CHART_HEIGHT} style={StyleSheet.absoluteFill}>
              {GRID_ROWS.map((f) => (
                <Line
                  key={f}
                  x1={0}
                  x2={width}
                  y1={CHART_PAD_TOP + usableHeight * f}
                  y2={CHART_PAD_TOP + usableHeight * f}
                  stroke={p.hairline}
                  strokeWidth={1}
                />
              ))}

              <Defs>
                <LinearGradient id="curveFill" x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0" stopColor={p.accent} stopOpacity={0.22} />
                  <Stop offset="1" stopColor={p.accent} stopOpacity={0} />
                </LinearGradient>
              </Defs>

              {areaPoints ? <Polygon points={areaPoints} fill="url(#curveFill)" /> : null}

              {/* Actual top-set weights ride beneath the e1RM curve as muted markers. */}
              {dotCoords.map((c, i) => (
                <Circle
                  key={`actual-${i}`}
                  cx={c.x}
                  cy={c.y}
                  r={2}
                  fill={p.mutedSoft}
                />
              ))}

              <Polyline
                points={linePoints}
                fill="none"
                stroke={p.accent}
                strokeWidth={1.75}
                strokeLinejoin="round"
                strokeLinecap="round"
              />
              {curveCoords.map((c, i) => (
                <Circle
                  key={`curve-${i}`}
                  cx={c.x}
                  cy={c.y}
                  r={i === curveCoords.length - 1 ? 3.5 : 2}
                  fill={i === curveCoords.length - 1 ? p.accent : p.ink}
                  stroke={p.accent}
                  strokeWidth={i === curveCoords.length - 1 ? 0 : 1.25}
                />
              ))}
            </Svg>
          </>
        )}
      </View>
    </View>
  );
}

const makeStyles = (p: Palette) =>
  StyleSheet.create({
  card: {
    marginHorizontal: 20,
    marginTop: 18,
    borderRadius: 18,
    backgroundColor: p.inkRaised,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: p.hairlineStrong,
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 6,
    overflow: "hidden",
  },
  readoutRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  eyebrow: {
    color: p.accent,
    fontSize: 9,
    fontFamily: FontFamilies.medium,
    letterSpacing: 2.4,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  valueRow: { flexDirection: "row", alignItems: "baseline", gap: 5 },
  value: {
    color: p.bone,
    fontSize: 38,
    fontFamily: FontFamilies.displayLight,
    letterSpacing: -1,
    fontVariant: ["tabular-nums"],
  },
  unit: {
    color: p.muted,
    fontSize: 13,
    fontFamily: FontFamilies.displayRegular,
    letterSpacing: 0.4,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 5,
    paddingHorizontal: 9,
    borderRadius: 999,
    marginTop: 3,
  },
  chipText: {
    fontSize: 11,
    fontFamily: FontFamilies.semibold,
    letterSpacing: 0.2,
    fontVariant: ["tabular-nums"],
  },
  chartWrap: {
    height: CHART_HEIGHT,
    marginTop: 12,
  },
});
