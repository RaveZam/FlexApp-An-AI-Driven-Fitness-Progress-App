import { usePalette, type Palette } from "@/src/theme";
import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import useTimeElapsed from "../hooks/useTimeElapsed";
import { useWorkoutSession } from "../hooks/useWorkoutSession";

function formatTime(totalSec: number): string {
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export default function HeroElapsedTime() {
  const p = usePalette();
  const styles = useMemo(() => makeStyles(p), [p]);
  const { createdAt } = useWorkoutSession();
  const elapsedSeconds = useTimeElapsed(createdAt);

  if (elapsedSeconds === undefined) return null;

  return (
    <View style={styles.block}>
      <Text style={styles.label}>Elapsed</Text>
      <Text style={styles.value}>{formatTime(elapsedSeconds)}</Text>
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
      color: p.bone,
      fontSize: 38,
      fontFamily: "Outfit_300Light",
      letterSpacing: -0.5,
      fontVariant: ["tabular-nums"],
      lineHeight: 42,
    },
  });
