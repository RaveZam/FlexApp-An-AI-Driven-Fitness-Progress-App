import React from "react";
import { StyleSheet, Text, View } from "react-native";
import formatMinutesSeconds from "../core/formatMinutesSeconds";
import useRestTimer from "../hooks/useRestTimer";

const ACCENT = "#34d399";
const MUTED = "#6b6b6b";

export default function HeroRestTime() {
  const restSeconds = useRestTimer();

  return (
    <View style={[styles.block, { alignItems: "flex-end" }]}>
      <Text style={styles.label}>Rest Interval</Text>
      <Text style={styles.value}>{formatMinutesSeconds(restSeconds)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  block: { flex: 1, justifyContent: "center" },
  label: {
    color: MUTED,
    fontSize: 9,
    fontFamily: "Inter_500Medium",
    marginBottom: 6,
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  value: {
    color: ACCENT,
    fontSize: 38,
    fontFamily: "Outfit_300Light",
    letterSpacing: -0.5,
    fontVariant: ["tabular-nums"],
    lineHeight: 42,
  },
});
