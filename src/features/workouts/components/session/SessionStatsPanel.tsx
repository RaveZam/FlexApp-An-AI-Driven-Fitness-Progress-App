import type {
  ExerciseBestRecord,
  ExerciseSessionPoint,
} from "@/src/features/workouts/hooks/useExerciseHistory";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

const ACCENT = "#34d399";
const ACCENT_DEEP = "#059669";
const BONE = "#f5f3ef";
const HAIRLINE = "rgba(245,243,239,0.07)";
const HAIRLINE_STRONG = "rgba(245,243,239,0.14)";
const MUTED = "#6b6b6b";
const MUTED_SOFT = "#3a3a3a";
const LABEL = "#9b9b9b";
const READABLE = "#b8b6b1";

type Props = {
  best: ExerciseBestRecord | null;
  recentSessions: ExerciseSessionPoint[];
  activeExerciseId: string;
};

export default function SessionStatsPanel({ best, recentSessions, activeExerciseId }: Props) {
  const [selectedBarIndex, setSelectedBarIndex] = useState<number | null>(null);

  React.useEffect(() => {
    setSelectedBarIndex(null);
  }, [activeExerciseId]);

  const maxChartWeight = recentSessions.reduce((m, p) => Math.max(m, p.maxWeight), 0);
  const selectedSession =
    selectedBarIndex !== null ? recentSessions[selectedBarIndex] ?? null : null;

  return (
    <Animated.View entering={FadeInDown.delay(180).duration(500)} style={styles.statsPanel}>
      <View style={styles.prSection}>
        <Text style={styles.sectionLabel}>Personal Record</Text>
        {best ? (
          <>
            <View style={styles.prValueRow}>
              <Text style={styles.prValue}>{best.weight}</Text>
              <Text style={styles.prValueUnit}>lb</Text>
            </View>
            <Text style={styles.prSubvalue}>
              × <Text style={styles.prSubvalueAccent}>{best.reps}</Text> reps
            </Text>
            <View style={styles.prRule} />
            <Text style={styles.prDate}>
              {new Date(best.date).toLocaleDateString("en-US", {
                month: "short",
                day: "2-digit",
                year: "numeric",
              })}
            </Text>
          </>
        ) : (
          <>
            <Text style={styles.prValuePlaceholder}>—</Text>
            <Text style={styles.prDate}>No record yet</Text>
          </>
        )}
      </View>

      <View style={styles.statsDivider} />

      <View style={styles.historySection}>
        <View style={styles.historyHeader}>
          <Text style={styles.sectionLabel}>Last 7 Sessions</Text>
          {selectedSession ? (
            <Text style={styles.chartTooltip}>
              <Text style={styles.chartTooltipValue}>{selectedSession.maxWeight}lb</Text>
              {selectedSession.repsAtMax > 0 ? ` × ${selectedSession.repsAtMax}` : ""}
              <Text style={styles.chartTooltipDate}>
                {"  "}·{"  "}
                {new Date(selectedSession.startedAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "2-digit",
                })}
              </Text>
            </Text>
          ) : (
            <Text style={styles.chartTooltipHint}>
              {recentSessions.length > 0 ? "Tap a bar" : ""}
            </Text>
          )}
        </View>

        <View style={styles.chartWrap}>
          <View style={styles.chartBaseline} />
          <View style={styles.historyChart}>
            {recentSessions.length === 0 ? (
              <Text style={styles.emptyChart}>No sessions yet</Text>
            ) : (
              recentSessions.map((p, i) => {
                const heightPx =
                  maxChartWeight > 0 ? Math.max(4, (p.maxWeight / maxChartWeight) * 56) : 4;
                const isSelected = selectedBarIndex === i;
                const isPR = best ? p.maxWeight >= best.weight : false;
                return (
                  <Pressable
                    key={p.sessionId}
                    hitSlop={8}
                    onPress={() => setSelectedBarIndex(isSelected ? null : i)}
                    style={styles.barTouch}
                  >
                    <View style={styles.barColumn}>
                      <View
                        style={{
                          width: 10,
                          height: heightPx,
                          borderRadius: 2,
                          overflow: "hidden",
                          opacity: isSelected
                            ? 1
                            : 0.55 + (i / Math.max(1, recentSessions.length - 1)) * 0.4,
                        }}
                      >
                        <LinearGradient
                          colors={isPR ? [ACCENT, ACCENT_DEEP] : [ACCENT, "rgba(52,211,153,0.35)"]}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 0, y: 1 }}
                          style={{ flex: 1 }}
                        />
                      </View>
                      {isSelected && <View style={styles.barIndicator} />}
                    </View>
                  </Pressable>
                );
              })
            )}
          </View>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  statsPanel: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginTop: 16,
    paddingVertical: 20,
    paddingHorizontal: 18,
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: HAIRLINE,
    backgroundColor: "#0a0a0a",
  },
  statsDivider: {
    width: StyleSheet.hairlineWidth,
    backgroundColor: HAIRLINE_STRONG,
    marginHorizontal: 16,
  },
  sectionLabel: {
    color: LABEL,
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 1.6,
    textTransform: "uppercase",
    marginBottom: 12,
  },
  prSection: { flex: 1 },
  prValueRow: { flexDirection: "row", alignItems: "baseline", gap: 4 },
  prValue: {
    color: BONE,
    fontSize: 36,
    fontFamily: "Outfit_300Light",
    letterSpacing: -1,
    fontVariant: ["tabular-nums"],
    lineHeight: 40,
  },
  prValueUnit: {
    color: MUTED,
    fontSize: 13,
    fontFamily: "Outfit_400Regular",
    letterSpacing: 0.5,
  },
  prValuePlaceholder: {
    color: MUTED_SOFT,
    fontSize: 36,
    fontFamily: "Outfit_200ExtraLight",
    lineHeight: 40,
  },
  prSubvalue: {
    color: READABLE,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    marginTop: 4,
    letterSpacing: 0.3,
  },
  prSubvalueAccent: { color: ACCENT, fontFamily: "Inter_600SemiBold" },
  prRule: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: HAIRLINE_STRONG,
    marginTop: 12,
    width: 24,
  },
  prDate: {
    color: MUTED,
    fontSize: 11,
    fontFamily: "Inter_500Medium",
    marginTop: 8,
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  historySection: { flex: 1.1 },
  historyHeader: { marginBottom: 12 },
  chartTooltip: {
    color: BONE,
    fontSize: 13,
    fontFamily: "Outfit_500Medium",
    letterSpacing: 0.2,
    marginTop: -6,
  },
  chartTooltipValue: {
    color: ACCENT,
    fontFamily: "Outfit_600SemiBold",
    fontVariant: ["tabular-nums"],
  },
  chartTooltipDate: {
    color: LABEL,
    fontFamily: "Inter_500Medium",
    fontSize: 11,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  chartTooltipHint: {
    color: MUTED,
    fontSize: 11,
    fontFamily: "Inter_500Medium",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginTop: -6,
    height: 16,
  },
  chartWrap: { position: "relative" },
  chartBaseline: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 8,
    height: StyleSheet.hairlineWidth,
    backgroundColor: HAIRLINE,
  },
  historyChart: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: 64,
    paddingBottom: 8,
  },
  barTouch: { paddingHorizontal: 2, justifyContent: "flex-end", alignItems: "center" },
  barColumn: { alignItems: "center" },
  barIndicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: ACCENT,
    marginTop: 4,
  },
  emptyChart: {
    color: MUTED,
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    letterSpacing: 0.5,
    alignSelf: "center",
    marginTop: 24,
  },
});
