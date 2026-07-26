import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";

import type { SessionColors } from "../constants/color";
import { useGetExercisePR } from "../hooks/useGetExercisePR";
import { useSessionColors } from "../hooks/useSessionColors";
import { useWorkoutSession } from "../hooks/useWorkoutSession";

export default function PersonalRecordPanel() {
  const c = useSessionColors();
  const styles = useMemo(() => makeStyles(c), [c]);
  const { activeExerciseId } = useWorkoutSession();
  const best = useGetExercisePR(activeExerciseId);
  return (
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
  );
}

const makeStyles = (c: SessionColors) =>
  StyleSheet.create({
    sectionLabel: {
      color: c.LABEL,
      fontSize: 11,
      fontFamily: "Inter_600SemiBold",
      letterSpacing: 1.6,
      textTransform: "uppercase",
      marginBottom: 12,
    },
    prSection: { flex: 1 },
    prValueRow: { flexDirection: "row", alignItems: "baseline", gap: 4 },
    prValue: {
      color: c.BONE,
      fontSize: 36,
      fontFamily: "Outfit_300Light",
      letterSpacing: -1,
      fontVariant: ["tabular-nums"],
      lineHeight: 40,
    },
    prValueUnit: {
      color: c.MUTED,
      fontSize: 13,
      fontFamily: "Outfit_400Regular",
      letterSpacing: 0.5,
    },
    prValuePlaceholder: {
      color: c.MUTED_SOFT,
      fontSize: 36,
      fontFamily: "Outfit_200ExtraLight",
      lineHeight: 40,
    },
    prSubvalue: {
      color: c.READABLE,
      fontSize: 14,
      fontFamily: "Inter_400Regular",
      marginTop: 4,
      letterSpacing: 0.3,
    },
    prSubvalueAccent: { color: c.ACCENT, fontFamily: "Inter_600SemiBold" },
    prRule: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: c.HAIRLINE_STRONG,
      marginTop: 12,
      width: 24,
    },
    prDate: {
      color: c.MUTED,
      fontSize: 11,
      fontFamily: "Inter_500Medium",
      marginTop: 8,
      letterSpacing: 0.8,
      textTransform: "uppercase",
    },
  });
