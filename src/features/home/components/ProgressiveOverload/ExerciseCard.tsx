import { FontFamilies } from "@/constants/theme";
import { usePalette, type Palette } from "@/src/theme";
import { Feather } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import ReAnimated, { FadeInDown } from "react-native-reanimated";
import { computeVolumeDeltaPct } from "../../core/exerciseDelta";
import type { ExerciseProgress } from "../../types/progressiveOverload";
import { ExerciseHistoryModal } from "./ExerciseHistoryModal";
import { ProgressionChart } from "./ProgressionChart";

type Props = {
  exercise: ExerciseProgress;
  delay: number;
};

export function ExerciseCard({ exercise, delay }: Props) {
  const p = usePalette();
  const styles = useMemo(() => makeStyles(p), [p]);
  const [historyVisible, setHistoryVisible] = useState(false);
  const { points } = exercise;
  const latest = points[points.length - 1];
  const deltaPct = computeVolumeDeltaPct(points);

  if (points.length === 0) {
    return null;
  }

  return (
    <>
      <Pressable onPress={() => setHistoryVisible(true)}>
        <ReAnimated.View
          entering={FadeInDown.delay(delay).duration(420)}
          style={styles.card}
        >
          <View style={styles.info}>
            <View style={styles.infoHead}>
              <Text style={styles.exerciseName} numberOfLines={1}>
                {exercise.name}
              </Text>
              <DeltaChip deltaPct={deltaPct} />
            </View>

            {latest && (
              <View style={styles.readout}>
                <Text style={styles.weight}>{latest.weight}</Text>
                <Text style={styles.unit}>lb</Text>
                <Text style={styles.reps}>× {latest.reps}</Text>
              </View>
            )}
          </View>

          <View style={styles.divider} />

          <ProgressionChart points={points} />
        </ReAnimated.View>
      </Pressable>

      <ExerciseHistoryModal
        visible={historyVisible}
        exercise={exercise}
        onClose={() => setHistoryVisible(false)}
      />
    </>
  );
}

function DeltaChip({ deltaPct }: { deltaPct: number | null }) {
  const p = usePalette();
  const styles = useMemo(() => makeStyles(p), [p]);
  if (deltaPct === null) {
    return (
      <View style={[styles.chip, styles.chipNeutral]}>
        <Text style={styles.chipTextNeutral}>NEW</Text>
      </View>
    );
  }
  const up = deltaPct >= 0;
  const color = up ? p.accent : p.danger;
  return (
    <View
      style={[
        styles.chip,
        // No "dangerSoft" fill token exists — nearest fit is dangerBorder, reused
        // here as the down-trend chip fill (mirrors the up-trend accentSoft usage).
        { backgroundColor: up ? p.accentSoft : p.dangerBorder },
      ]}
    >
      <Feather
        name={up ? "trending-up" : "trending-down"}
        size={10}
        color={color}
      />
      <Text style={[styles.chipText, { color }]}>
        {up ? "+" : "−"}
        {Math.abs(deltaPct)}%
      </Text>
    </View>
  );
}

const makeStyles = (p: Palette) =>
  StyleSheet.create({
    card: {
      flexDirection: "row",
      alignItems: "center",
      borderRadius: 14,
      backgroundColor: "rgba(245,243,239,0.035)",
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: p.hairline,
      paddingVertical: 13,
      paddingHorizontal: 15,
      gap: 15,
      overflow: "hidden",
    },
    info: { flex: 1, gap: 9 },
    infoHead: { flexDirection: "row", alignItems: "center", gap: 8 },
    exerciseName: {
      flex: 1,
      color: p.bone,
      fontSize: 13,
      fontFamily: FontFamilies.semibold,
      letterSpacing: 0.1,
    },
    readout: { flexDirection: "row", alignItems: "baseline", gap: 5 },
    divider: {
      alignSelf: "stretch",
      width: StyleSheet.hairlineWidth,
      marginVertical: 2,
      backgroundColor: p.hairline,
    },
    weight: {
      color: p.bone,
      fontSize: 20,
      fontFamily: FontFamilies.semibold,
      letterSpacing: -0.4,
      fontVariant: ["tabular-nums"],
    },
    unit: {
      color: p.muted,
      fontSize: 10,
      fontFamily: FontFamilies.displayRegular,
      letterSpacing: 0.4,
    },
    reps: {
      color: p.accent,
      fontSize: 11,
      fontFamily: FontFamilies.medium,
      fontVariant: ["tabular-nums"],
    },
    chip: {
      flexDirection: "row",
      alignItems: "center",
      gap: 3,
      paddingVertical: 2,
      paddingHorizontal: 6,
      borderRadius: 999,
    },
    chipNeutral: { backgroundColor: p.hairline },
    chipText: {
      fontSize: 10,
      fontFamily: FontFamilies.semibold,
      letterSpacing: 0.2,
      fontVariant: ["tabular-nums"],
    },
    chipTextNeutral: {
      color: p.muted,
      fontSize: 9,
      fontFamily: FontFamilies.semibold,
      letterSpacing: 1.5,
    },
  });
