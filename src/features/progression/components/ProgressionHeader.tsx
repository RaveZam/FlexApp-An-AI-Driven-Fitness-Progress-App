import { FontFamilies } from "@/constants/theme";
import { usePalette, type Palette } from "@/src/theme";
import { Ionicons } from "@expo/vector-icons";
import { useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export function ProgressionHeader({
  muscleGroup,
  onBack,
}: {
  muscleGroup: string;
  onBack: () => void;
}) {
  const p = usePalette();
  const styles = useMemo(() => makeStyles(p), [p]);
  return (
    <View style={styles.navRow}>
      <Pressable onPress={onBack} style={styles.iconButton}>
        <Ionicons name="chevron-back" size={20} color={p.bone} />
      </Pressable>

      <View style={styles.groupChip}>
        <Text style={styles.groupText}>{muscleGroup}</Text>
      </View>
    </View>
  );
}

const makeStyles = (p: Palette) =>
  StyleSheet.create({
  navRow: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: p.inkRaised,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: p.hairlineStrong,
  },
  groupChip: {
    paddingVertical: 7,
    paddingHorizontal: 13,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: p.hairline,
    backgroundColor: p.hairline,
  },
  groupText: {
    color: p.muted,
    fontSize: 11,
    fontFamily: FontFamilies.medium,
    letterSpacing: 0.4,
    textTransform: "capitalize",
  },
});
