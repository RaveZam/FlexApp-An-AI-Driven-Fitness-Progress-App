import { FontFamilies } from "@/constants/theme";
import { usePalette, type Palette } from "@/src/theme";
import { useMemo } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

type Props = {
  groups: string[];
  selected: string;
  onSelect: (group: string) => void;
};

export function MuscleFilterChips({ groups, selected, onSelect }: Props) {
  const p = usePalette();
  const styles = useMemo(() => makeStyles(p), [p]);
  if (groups.length === 0) return null;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {groups.map((chip) => {
        const active = chip === selected;
        return (
          <Pressable
            key={chip}
            hitSlop={6}
            onPress={() => onSelect(chip)}
            style={[styles.chip, active && styles.chipActive]}
          >
            {active && <View style={styles.chipDot} />}
            <Text style={[styles.chipText, active && styles.chipTextActive]}>{chip}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const makeStyles = (p: Palette) =>
  StyleSheet.create({
  row: { gap: 8, paddingVertical: 2, paddingRight: 4 },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 13,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: p.hairline,
    backgroundColor: p.hairline,
  },
  chipActive: {
    borderColor: p.accentBorder,
    backgroundColor: p.accentSoft,
  },
  chipDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: p.accent,
  },
  chipText: {
    color: p.muted,
    fontSize: 11,
    fontFamily: FontFamilies.medium,
    letterSpacing: 0.4,
    textTransform: "capitalize",
  },
  chipTextActive: { color: p.accent, fontFamily: FontFamilies.semibold },
});
