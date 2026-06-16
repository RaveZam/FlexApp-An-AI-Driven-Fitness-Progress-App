import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  FadeInDown,
  FadeOutDown,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";

import { calculateSessionStats } from "../core/sessionStats";
import { useGetExercisePR } from "../hooks/useGetExercisePR";
import { useGetLast7TopSetsExercise } from "../hooks/useGetLast7TopSets";
import { useWorkoutSession } from "../hooks/useWorkoutSession";

const ACCENT = "#34d399";
const ACCENT_DEEP = "#059669";
const HIGHLIGHT = "#fbbf24";
const HIGHLIGHT_DEEP = "#f59e0b";
const BONE = "#f5f3ef";
const HAIRLINE = "rgba(245,243,239,0.07)";
const MUTED = "#6b6b6b";
const LABEL = "#9b9b9b";

export default function Last7SessionsPanel() {
  const { activeExerciseId } = useWorkoutSession();
  const best = useGetExercisePR(activeExerciseId);
  const recentSessions = useGetLast7TopSetsExercise(activeExerciseId);

  const [selectedBarIndex, setSelectedBarIndex] = useState<number | null>(null);

  const { maxChartVolume, selectedSession } = calculateSessionStats(
    recentSessions,
    selectedBarIndex,
  );

  useEffect(() => {
    setSelectedBarIndex(null);
  }, [activeExerciseId]);

  return (
    <View style={styles.historySection}>
      <View style={styles.historyHeader}>
        <Text style={styles.sectionLabel}>Last 7 Sessions</Text>
        <View style={styles.tooltipWheel}>
          {selectedSession ? (
            <Animated.Text
              key={selectedSession.sessionId}
              entering={FadeInDown.duration(220)}
              exiting={FadeOutDown.duration(220)}
              style={[styles.chartTooltip, styles.wheelItem]}
            >
              <Text style={styles.chartTooltipValue}>
                {selectedSession.maxWeight}lb
              </Text>
              {selectedSession.repsAtMax > 0
                ? ` × ${selectedSession.repsAtMax}`
                : ""}
              <Text style={styles.chartTooltipDate}>
                {"  "}·{"  "}
                {new Date(selectedSession.startedAt).toLocaleDateString(
                  "en-US",
                  {
                    month: "short",
                    day: "2-digit",
                  },
                )}
              </Text>
            </Animated.Text>
          ) : (
            <Animated.Text
              key="hint"
              entering={FadeInDown.duration(220)}
              exiting={FadeOutDown.duration(220)}
              style={[styles.chartTooltipHint, styles.wheelItem]}
            >
              {recentSessions.length > 0 ? "Tap a bar" : ""}
            </Animated.Text>
          )}
        </View>
      </View>

      <View style={styles.chartWrap}>
        <View style={styles.chartBaseline} />
        <View style={styles.historyChart}>
          {recentSessions.length === 0 ? (
            <Text style={styles.emptyChart}>No sessions yet</Text>
          ) : (
            recentSessions.map((p, i) => {
              const volume = p.maxWeight * Math.max(1, p.repsAtMax);
              const heightPx =
                maxChartVolume > 0
                  ? Math.max(4, (volume / maxChartVolume) * 56)
                  : 4;
              const restingOpacity =
                0.55 + (i / Math.max(1, recentSessions.length - 1)) * 0.4;
              return (
                <HistoryBar
                  key={p.sessionId}
                  index={i}
                  heightPx={heightPx}
                  restingOpacity={restingOpacity}
                  isSelected={selectedBarIndex === i}
                  isPR={best ? p.maxWeight >= best.weight : false}
                  onPress={() =>
                    setSelectedBarIndex(selectedBarIndex === i ? null : i)
                  }
                />
              );
            })
          )}
        </View>
      </View>
    </View>
  );
}

type HistoryBarProps = {
  index: number;
  heightPx: number;
  restingOpacity: number;
  isSelected: boolean;
  isPR: boolean;
  onPress: () => void;
};

function HistoryBar({
  index,
  heightPx,
  restingOpacity,
  isSelected,
  isPR,
  onPress,
}: HistoryBarProps) {
  // Grows from the baseline, staggered by index so bars appear one by one.
  const grow = useSharedValue(0);
  React.useEffect(() => {
    grow.value = withDelay(
      260 + index * 70,
      withTiming(1, { duration: 420, easing: Easing.out(Easing.cubic) }),
    );
  }, [grow, index]);

  const growStyle = useAnimatedStyle(() => ({
    height: heightPx * grow.value,
  }));
  const highlightStyle = useAnimatedStyle(() => ({
    opacity: withTiming(isSelected ? 1 : 0, { duration: 220 }),
  }));
  const baseStyle = useAnimatedStyle(() => ({
    opacity: withTiming(isSelected ? 1 : restingOpacity, { duration: 220 }),
  }));

  return (
    <Pressable hitSlop={8} onPress={onPress} style={styles.barTouch}>
      <View style={styles.barColumn}>
        <Animated.View
          style={[{ width: 10, borderRadius: 2, overflow: "hidden" }, growStyle]}
        >
          <Animated.View style={[StyleSheet.absoluteFill, baseStyle]}>
            <LinearGradient
              colors={
                isPR ? [ACCENT, ACCENT_DEEP] : [ACCENT, "rgba(52,211,153,0.35)"]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={{ flex: 1 }}
            />
          </Animated.View>
          <Animated.View style={[StyleSheet.absoluteFill, highlightStyle]}>
            <LinearGradient
              colors={[HIGHLIGHT, HIGHLIGHT_DEEP]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={{ flex: 1 }}
            />
          </Animated.View>
        </Animated.View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  sectionLabel: {
    color: LABEL,
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 1.6,
    textTransform: "uppercase",
    marginBottom: 12,
  },
  historySection: { flex: 1.1 },
  historyHeader: { marginBottom: 12 },
  tooltipWheel: {
    position: "relative",
    height: 18,
    marginTop: -6,
    overflow: "hidden",
    justifyContent: "center",
  },
  wheelItem: { position: "absolute", left: 0, right: 0 },
  chartTooltip: {
    color: BONE,
    fontSize: 13,
    fontFamily: "Outfit_500Medium",
    letterSpacing: 0.2,
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
    justifyContent: "flex-start",
    gap: 12,
    height: 64,
    paddingBottom: 8,
  },
  barTouch: {
    paddingHorizontal: 2,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  barColumn: { alignItems: "center" },
  emptyChart: {
    color: MUTED,
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    letterSpacing: 0.5,
    alignSelf: "center",
    marginTop: 24,
  },
});
