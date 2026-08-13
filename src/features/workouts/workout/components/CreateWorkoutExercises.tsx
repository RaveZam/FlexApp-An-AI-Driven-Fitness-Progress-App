import { usePalette, type Palette } from "@/src/theme";
import { Ionicons } from "@expo/vector-icons";
import { useMemo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown, FadeInRight } from "react-native-reanimated";
import type { ExerciseDraft } from "../hooks/useCreateWorkoutScreen";
import ExerciseEditorRow from "./ExerciseEditorRow";

type Props = {
  exercises: ExerciseDraft[];
  onChange: (
    key: string,
    field: "targetSets" | "targetReps",
    value: string
  ) => void;
  onRemove: (key: string) => void;
  onAddExercise: () => void;
};

export function CreateWorkoutExercises({
  exercises,
  onChange,
  onRemove,
  onAddExercise,
}: Props) {
  const p = usePalette();
  const styles = useMemo(() => makeStyles(p), [p]);

  return (
    <Animated.View entering={FadeInDown.delay(180).duration(350)}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.accentBar} />
          <Text style={styles.sectionTitle}>Exercises</Text>
        </View>
        {exercises.length > 0 && (
          <Text style={styles.count}>{exercises.length} added</Text>
        )}
      </View>

      <View style={styles.list}>
        {exercises.map((row, index) => (
          <Animated.View
            key={row.key}
            entering={FadeInRight.delay(index * 50).duration(400)}
          >
            <ExerciseEditorRow
              index={index}
              catalogExercise={row.catalogExercise}
              targetSets={row.targetSets}
              targetReps={row.targetReps}
              onChange={(field, value) => onChange(row.key, field, value)}
              onRemove={() => onRemove(row.key)}
            />
          </Animated.View>
        ))}
      </View>

      <TouchableOpacity
        onPress={onAddExercise}
        activeOpacity={0.7}
        style={[styles.addButton, exercises.length > 0 && styles.addButtonSpaced]}
      >
        <Ionicons name="add" size={16} color={p.accent} />
        <Text style={styles.addText}>Add Exercise</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const makeStyles = (p: Palette) =>
  StyleSheet.create({
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 12,
    },
    headerLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
    accentBar: {
      width: 4,
      height: 18,
      borderRadius: 2,
      backgroundColor: p.accent,
    },
    sectionTitle: {
      color: p.bone,
      fontSize: 13,
      fontFamily: "Inter_500Medium",
      letterSpacing: 0.8,
      textTransform: "uppercase",
    },
    count: {
      color: p.mutedSoft,
      fontSize: 12,
      fontFamily: "Inter_400Regular",
    },
    list: { gap: 10 },
    addButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
      paddingVertical: 14,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: p.accentBorderSoft,
      borderStyle: "dashed",
    },
    addButtonSpaced: { marginTop: 12 },
    addText: {
      color: p.accent,
      fontSize: 13,
      fontFamily: "Inter_500Medium",
      letterSpacing: 0.3,
    },
  });
