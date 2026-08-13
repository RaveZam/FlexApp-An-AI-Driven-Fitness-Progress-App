import { FontFamilies } from "@/constants/theme";
import { usePalette, type Palette } from "@/src/theme";
import { Ionicons } from "@expo/vector-icons";
import { useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  selectedCount: number;
  onAddExercise: () => void;
  onRemoveSelected: () => void;
};

export function WorkoutEditActions({
  selectedCount,
  onAddExercise,
  onRemoveSelected,
}: Props) {
  const p = usePalette();
  const styles = useMemo(() => makeStyles(p), [p]);

  return (
    <View style={styles.actions}>
      <Pressable onPress={onAddExercise} style={styles.addButton}>
        <Ionicons name="add" size={18} color={p.accent} />
        <Text style={styles.addText}>Add Exercise</Text>
      </Pressable>

      {selectedCount > 0 && (
        <Pressable onPress={onRemoveSelected} style={styles.removeButton}>
          <Ionicons name="trash-outline" size={16} color={p.danger} />
          <Text style={styles.removeText}>
            Remove {selectedCount} Exercise{selectedCount > 1 ? "s" : ""}
          </Text>
        </Pressable>
      )}
    </View>
  );
}

const makeStyles = (p: Palette) =>
  StyleSheet.create({
    actions: { marginTop: 16, gap: 10 },
    addButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      paddingVertical: 14,
      borderRadius: 14,
      backgroundColor: p.accentSoft,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: p.accentBorder,
    },
    addText: {
      color: p.accent,
      fontSize: 12,
      fontFamily: FontFamilies.displayMedium,
      letterSpacing: 1.6,
      textTransform: "uppercase",
    },
    removeButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      paddingVertical: 14,
      borderRadius: 14,
      backgroundColor: p.dangerSoft,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: p.dangerBorder,
    },
    removeText: {
      color: p.danger,
      fontSize: 12,
      fontFamily: FontFamilies.displayMedium,
      letterSpacing: 1.6,
      textTransform: "uppercase",
    },
  });
