import { FontFamilies } from "@/constants/theme";
import { usePalette, type Palette } from "@/src/theme";
import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { estimateOneRepMax } from "../core/estimateOneRepMax";
import type { ExerciseSessionPoint } from "../types";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

export function SessionHistoryList({ points }: { points: ExerciseSessionPoint[] }) {
  const p = usePalette();
  const styles = useMemo(() => makeStyles(p), [p]);
  const rows = [...points].reverse();

  return (
    <View style={styles.section}>
      <Text style={styles.sectionLabel}>Session History</Text>
      <View style={styles.list}>
        {rows.map((point) => (
          <View key={point.sessionId} style={styles.row}>
            <Text style={styles.date}>{formatDate(point.startedAt)}</Text>
            <View style={styles.setInfo}>
              <Text style={styles.weight}>{point.maxWeight}</Text>
              <Text style={styles.unit}>lb</Text>
              <Text style={styles.reps}>× {point.repsAtMax}</Text>
            </View>
            <Text style={styles.e1rm}>
              {estimateOneRepMax(point.maxWeight, point.repsAtMax)} lb e1RM
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const makeStyles = (p: Palette) =>
  StyleSheet.create({
  section: { marginHorizontal: 20, marginTop: 24 },
  sectionLabel: {
    color: p.muted,
    fontSize: 10,
    fontFamily: FontFamilies.medium,
    letterSpacing: 2.4,
    textTransform: "uppercase",
    marginBottom: 12,
  },
  list: { gap: 1 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: p.hairline,
  },
  date: {
    width: 64,
    color: p.muted,
    fontSize: 11,
    fontFamily: FontFamilies.regular,
    letterSpacing: 0.2,
  },
  setInfo: { flex: 1, flexDirection: "row", alignItems: "baseline", gap: 4 },
  weight: {
    color: p.bone,
    fontSize: 14,
    fontFamily: FontFamilies.semibold,
    fontVariant: ["tabular-nums"],
  },
  unit: {
    color: p.muted,
    fontSize: 10,
    fontFamily: FontFamilies.displayRegular,
  },
  reps: {
    color: p.accent,
    fontSize: 11,
    fontFamily: FontFamilies.medium,
    fontVariant: ["tabular-nums"],
  },
  e1rm: {
    color: p.mutedSoft,
    fontSize: 10,
    fontFamily: FontFamilies.regular,
    fontVariant: ["tabular-nums"],
  },
});
