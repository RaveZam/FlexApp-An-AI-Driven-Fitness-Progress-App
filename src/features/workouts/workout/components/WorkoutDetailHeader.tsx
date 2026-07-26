import { usePalette, type Palette } from "@/src/theme";
import { Ionicons } from "@expo/vector-icons";
import { useMemo } from "react";
import { Pressable, StyleSheet, View } from "react-native";

export function WorkoutDetailHeader({
  editing,
  onBack,
  onToggleEdit,
}: {
  editing: boolean;
  onBack: () => void;
  onToggleEdit: () => void;
}) {
  const p = usePalette();
  const styles = useMemo(() => makeStyles(p), [p]);
  return (
    <View style={styles.navRow}>
      <Pressable onPress={onBack} style={styles.iconButton}>
        <Ionicons
          name={editing ? "close" : "chevron-back"}
          size={20}
          color={p.bone}
        />
      </Pressable>

      <Pressable
        onPress={onToggleEdit}
        style={[styles.iconButton, editing && styles.iconButtonOn]}
      >
        <Ionicons
          name={editing ? "checkmark" : "pencil"}
          size={editing ? 18 : 15}
          color={editing ? p.accent : p.muted}
        />
      </Pressable>
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
  iconButtonOn: {
    backgroundColor: p.accentSoft,
    borderColor: p.accentBorder,
  },
});
