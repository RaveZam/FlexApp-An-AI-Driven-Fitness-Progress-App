import { Palette } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
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
  return (
    <View style={styles.navRow}>
      <Pressable onPress={onBack} style={styles.iconButton}>
        <Ionicons
          name={editing ? "close" : "chevron-back"}
          size={20}
          color={Palette.bone}
        />
      </Pressable>

      <Pressable
        onPress={onToggleEdit}
        style={[styles.iconButton, editing && styles.iconButtonOn]}
      >
        <Ionicons
          name={editing ? "checkmark" : "pencil"}
          size={editing ? 18 : 15}
          color={editing ? Palette.accent : Palette.muted}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
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
    backgroundColor: Palette.inkRaised,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Palette.hairlineStrong,
  },
  iconButtonOn: {
    backgroundColor: Palette.accentSoft,
    borderColor: Palette.accentBorder,
  },
});
