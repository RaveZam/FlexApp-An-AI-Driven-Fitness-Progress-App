import React from "react";
import { StyleSheet, Text, View } from "react-native";

const ACCENT = "#34d399";
const MUTED = "#6b6b6b";

type Props = {
  restSeconds: number;
};

export default function HeroRestTime({ restSeconds }: Props) {
  const restMin = Math.floor(restSeconds / 60);
  const restSec = (restSeconds % 60).toString().padStart(2, "0");

  return (
    <View style={[styles.block, { alignItems: "flex-end" }]}>
      <Text style={styles.label}>Rest Interval</Text>
      <Text style={styles.value}>
        {restMin}:{restSec}
      </Text>
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
