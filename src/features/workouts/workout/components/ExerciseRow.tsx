import { FontFamilies } from "@/constants/theme";
import { usePalette, type Palette } from "@/src/theme";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import type { Exercise } from "../../types";

const EXERCISE_IMAGES: Record<string, any> = {
  "lat pulldown": require("@/assets/images/WorkoutImages/latpulldownimage.webp"),
};

function imageForExercise(name: string) {
  return EXERCISE_IMAGES[name.trim().toLowerCase()] ?? null;
}

export function ExerciseRow({
  exercise,
  index,
  editing,
  selected,
  onToggle,
  onUpdateTargets,
}: {
  exercise: Exercise;
  index: number;
  editing: boolean;
  selected: boolean;
  onToggle: () => void;
  onUpdateTargets: (targetSets: number, targetReps: number) => void;
}) {
  const p = usePalette();
  const styles = useMemo(() => makeStyles(p), [p]);
  const image = imageForExercise(exercise.name);
  const [setsText, setSetsText] = useState(String(exercise.targetSets));
  const [repsText, setRepsText] = useState(String(exercise.targetReps));
  const showInputs = editing && !selected;

  function changeSets(value: string) {
    setSetsText(value);
    const next = parseInt(value, 10);
    if (next >= 1 && next !== exercise.targetSets) onUpdateTargets(next, exercise.targetReps);
  }

  function changeReps(value: string) {
    setRepsText(value);
    const next = parseInt(value, 10);
    if (next >= 1 && next !== exercise.targetReps) onUpdateTargets(exercise.targetSets, next);
  }

  // onBlur restores the displayed value if the field was left empty/invalid
  function restoreSets() {
    if (!(parseInt(setsText, 10) >= 1)) setSetsText(String(exercise.targetSets));
  }

  function restoreReps() {
    if (!(parseInt(repsText, 10) >= 1)) setRepsText(String(exercise.targetReps));
  }

  return (
    <Animated.View entering={FadeInDown.delay(100 + index * 50).duration(400)}>
      <View style={[styles.card, selected && styles.cardSelected]}>
        <Pressable onPress={editing ? onToggle : undefined}>
          <View style={styles.topRow}>
            {editing && (
              <View style={styles.checkWrap}>
                <View style={[styles.checkbox, selected && styles.checkboxOn]}>
                  {selected && <Ionicons name="checkmark" size={13} color={p.onAccent} />}
                </View>
              </View>
            )}

            <View
              style={[
                styles.rail,
                { backgroundColor: selected ? p.danger : p.accent },
                editing && { marginLeft: 10 },
              ]}
            />

            <View style={[styles.thumb, editing && styles.thumbCompact]}>
              {image ? (
                <Image
                  source={image}
                  style={styles.thumbImage}
                  contentFit="cover"
                  transition={200}
                />
              ) : (
                <Ionicons
                  name="barbell-outline"
                  size={editing ? 18 : 22}
                  color={p.mutedSoft}
                />
              )}
            </View>

            <View style={[styles.info, editing && styles.infoCompact]}>
              <Text
                style={[styles.name, selected && { color: p.danger }]}
                numberOfLines={1}
              >
                {exercise.name}
              </Text>

              {showInputs ? (
                <View style={styles.inlineInputs}>
                  <NumberCell
                    label="Sets"
                    value={setsText}
                    onChangeText={changeSets}
                    onBlur={restoreSets}
                    placeholder={String(exercise.targetSets)}
                  />
                  <NumberCell
                    label="Reps"
                    value={repsText}
                    onChangeText={changeReps}
                    onBlur={restoreReps}
                    placeholder={String(exercise.targetReps)}
                  />
                </View>
              ) : (
                <Text
                  style={[styles.target, selected && { color: p.danger }]}
                >
                  {exercise.targetSets} × {exercise.targetReps}
                </Text>
              )}
            </View>
          </View>
        </Pressable>
      </View>
    </Animated.View>
  );
}

function NumberCell({
  label,
  value,
  onChangeText,
  onBlur,
  placeholder,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  onBlur: () => void;
  placeholder: string;
}) {
  const p = usePalette();
  const styles = useMemo(() => makeStyles(p), [p]);
  return (
    <View style={styles.cell}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        onBlur={onBlur}
        keyboardType="number-pad"
        placeholder={placeholder}
        placeholderTextColor={p.mutedSoft}
        style={styles.cellInput}
      />
      <Text style={styles.cellLabel}>{label}</Text>
    </View>
  );
}

const makeStyles = (p: Palette) =>
  StyleSheet.create({
  card: {
    backgroundColor: p.inkRaised,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: p.hairline,
    overflow: "hidden",
  },
  cardSelected: {
    backgroundColor: p.dangerSoft,
    borderColor: p.dangerBorder,
  },
  topRow: { flexDirection: "row", alignItems: "center" },
  checkWrap: { paddingLeft: 12 },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: p.mutedSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxOn: {
    borderColor: p.danger,
    backgroundColor: p.danger,
  },
  rail: { width: 3, alignSelf: "stretch", opacity: 0.7 },
  thumb: {
    width: 54,
    height: 54,
    margin: 10,
    borderRadius: 10,
    backgroundColor: p.inkSunken,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  thumbCompact: {
    width: 38,
    height: 38,
    margin: 9,
    borderRadius: 9,
  },
  thumbImage: { width: "100%", height: "100%" },
  info: {
    flex: 1,
    paddingVertical: 14,
    paddingRight: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  infoCompact: {
    paddingVertical: 8,
    paddingRight: 10,
  },
  name: {
    color: p.bone,
    fontSize: 14.5,
    fontFamily: FontFamilies.medium,
    letterSpacing: -0.2,
    flex: 1,
  },
  target: {
    color: p.accent,
    fontSize: 13,
    fontFamily: FontFamilies.displayMedium,
    letterSpacing: 0.3,
  },
  inlineInputs: {
    flexDirection: "row",
    gap: 8,
  },
  cell: { alignItems: "center", width: 46 },
  cellLabel: {
    color: p.muted,
    fontSize: 8,
    fontFamily: FontFamilies.medium,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginTop: 3,
  },
  cellInput: {
    backgroundColor: p.inkSunken,
    borderRadius: 9,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: p.hairlineStrong,
    color: p.bone,
    fontFamily: FontFamilies.displayMedium,
    fontSize: 15,
    paddingVertical: 6,
    width: "100%",
    textAlign: "center",
  },
});
