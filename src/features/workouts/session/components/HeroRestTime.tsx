import { usePalette, type Palette } from "@/src/theme";
import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import formatMinutesSeconds from "../core/formatMinutesSeconds";
import useRestTimer from "../hooks/useRestTimer";

export default function HeroRestTime() {
  const p = usePalette();
  const styles = useMemo(() => makeStyles(p), [p]);
  const restSeconds = useRestTimer();

  return (
    <View style={[styles.block, { alignItems: "flex-end" }]}>
      <Text style={styles.label}>Rest Interval</Text>
      <Text style={styles.value}>{formatMinutesSeconds(restSeconds)}</Text>
    </View>
  );
}

const makeStyles = (p: Palette) =>
  StyleSheet.create({
    block: { flex: 1, justifyContent: "center" },
    label: {
      color: p.muted,
      fontSize: 9,
      fontFamily: "Inter_500Medium",
      marginBottom: 6,
      letterSpacing: 2,
      textTransform: "uppercase",
    },
    value: {
      color: p.accent,
      fontSize: 38,
      fontFamily: "Outfit_300Light",
      letterSpacing: -0.5,
      fontVariant: ["tabular-nums"],
      lineHeight: 42,
    },
  });
