import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

const ACCENT = "#34d399";
const BONE = "#f5f3ef";
const HAIRLINE = "rgba(245,243,239,0.07)";
const HAIRLINE_STRONG = "rgba(245,243,239,0.14)";
const MUTED = "#6b6b6b";

function formatTime(totalSec: number): string {
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}


type Props = {
  elapsedSeconds: number;
  restSeconds: number;
};

export default function SessionTimerHero({ elapsedSeconds, restSeconds }: Props) {
  const restMin = Math.floor(restSeconds / 60);
  const restSec = (restSeconds % 60).toString().padStart(2, "0");

  return (
    <Animated.View entering={FadeInDown.delay(60).duration(400)} style={styles.timerHero}>
      <View style={styles.timerBlock}>
        <Text style={styles.timerLabel}>Elapsed</Text>
        <Text style={styles.timerValue}>{formatTime(elapsedSeconds)}</Text>
      </View>
      <View style={styles.timerDivider} />
      <View style={[styles.timerBlock, { alignItems: "flex-end" }]}>
        <Text style={styles.timerLabel}>Rest Interval</Text>
        <Text style={styles.timerValueAlt}>
          {restMin}:{restSec}
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  timerHero: {
    flexDirection: "row",
    alignItems: "stretch",
    paddingHorizontal: 24,
    paddingVertical: 22,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: HAIRLINE,
  },
  timerBlock: { flex: 1, justifyContent: "center" },
  timerDivider: {
    width: StyleSheet.hairlineWidth,
    backgroundColor: HAIRLINE_STRONG,
    marginHorizontal: 18,
  },
  timerLabel: {
    color: MUTED,
    fontSize: 9,
    fontFamily: "Inter_500Medium",
    marginBottom: 6,
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  timerValue: {
    color: BONE,
    fontSize: 38,
    fontFamily: "Outfit_300Light",
    letterSpacing: -0.5,
    fontVariant: ["tabular-nums"],
    lineHeight: 42,
  },
  timerValueAlt: {
    color: ACCENT,
    fontSize: 38,
    fontFamily: "Outfit_300Light",
    letterSpacing: -0.5,
    fontVariant: ["tabular-nums"],
    lineHeight: 42,
  },
});
