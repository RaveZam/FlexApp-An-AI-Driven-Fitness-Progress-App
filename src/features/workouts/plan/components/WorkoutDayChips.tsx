import { FontFamilies } from "@/constants/theme";
import { usePalette, type Palette } from "@/src/theme";
import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { DAY_LABELS } from "../../dayLabels";

type Props = { days: number[] };

export function WorkoutDayChips({ days }: Props) {
  const p = usePalette();
  const styles = useMemo(() => makeStyles(p), [p]);

  if (days.length === 0) return null;

  return (
    <View style={styles.dayRow}>
      {DAY_LABELS.map((label, i) => {
        const on = days.includes(i);
        return (
          <View key={i} style={[styles.dayChip, on && styles.dayChipOn]}>
            <Text style={[styles.dayText, on && styles.dayTextOn]}>{label}</Text>
          </View>
        );
      })}
    </View>
  );
}

const makeStyles = (p: Palette) =>
  StyleSheet.create({
    dayRow: { flexDirection: "row", gap: 5, marginTop: 12 },
    dayChip: {
      width: 22,
      height: 22,
      borderRadius: 7,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: p.hairline,
    },
    dayChipOn: {
      backgroundColor: p.accentSoft,
      borderColor: p.accentBorder,
    },
    dayText: {
      color: p.mutedSoft,
      fontSize: 9,
      fontFamily: FontFamilies.semibold,
    },
    dayTextOn: { color: p.accent },
  });
