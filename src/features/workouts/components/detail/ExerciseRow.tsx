import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import Animated, { FadeInRight } from "react-native-reanimated";
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
    <Animated.View entering={FadeInRight.delay(100 + index * 60).duration(400)}>
      <View
        style={{
          backgroundColor: selected ? "rgba(239,68,68,0.08)" : "#191919",
          borderRadius: 12,
          borderWidth: 1,
          borderColor: selected ? "rgba(239,68,68,0.35)" : "rgba(255,255,255,0.04)",
          overflow: "hidden",
        }}
      >
        <TouchableOpacity
          activeOpacity={editing ? 0.7 : 1}
          onPress={editing ? onToggle : undefined}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {editing && (
              <View style={{ paddingLeft: 12 }}>
                <View
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 11,
                    borderWidth: 2,
                    borderColor: selected ? "#ef4444" : "#444",
                    backgroundColor: selected ? "#ef4444" : "transparent",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {selected && <Ionicons name="checkmark" size={13} color="#fff" />}
                </View>
              </View>
            )}
            <View
              style={{
                width: 3,
                alignSelf: "stretch",
                backgroundColor: selected ? "#ef4444" : "#10b981",
                opacity: 0.5,
                marginLeft: editing ? 10 : 0,
              }}
            />
            <View
              style={{
                width: 56,
                height: 56,
                margin: 10,
                borderRadius: 8,
                backgroundColor: "#0f0f0f",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              {image ? (
                <Image
                  source={image}
                  style={{ width: "100%", height: "100%" }}
                  contentFit="cover"
                  transition={200}
                />
              ) : (
                <Ionicons name="barbell-outline" size={22} color="#333" />
              )}
            </View>
            <View
              style={{
                flex: 1,
                paddingVertical: 14,
                paddingRight: 14,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text
                style={{
                  color: selected ? "#f87171" : "#e0e0e0",
                  fontSize: 14,
                  fontFamily: "Inter_400Regular",
                  flex: 1,
                }}
              >
                {exercise.name}
              </Text>
              {!showInputs && (
                <Text
                  style={{
                    color: selected ? "#f87171" : "#10b981",
                    fontSize: 13,
                    fontFamily: "Inter_500Medium",
                    marginLeft: 12,
                  }}
                >
                  {exercise.targetSets} × {exercise.targetReps}
                </Text>
              )}
            </View>
          </View>
        </TouchableOpacity>

        {showInputs && (
          <View
            style={{
              flexDirection: "row",
              paddingHorizontal: 14,
              paddingBottom: 12,
              paddingTop: 2,
              gap: 12,
            }}
          >
            <NumberCell
              label="Sets"
              value={setsText}
              onChangeText={changeSets}
              onBlur={restoreSets}
              placeholder={String(exercise.targetSets)}
            />
            <View
              style={{
                width: 1,
                alignSelf: "stretch",
                backgroundColor: "rgba(255,255,255,0.04)",
                marginVertical: 4,
              }}
            />
            <NumberCell
              label="Reps"
              value={repsText}
              onChangeText={changeReps}
              onBlur={restoreReps}
              placeholder={String(exercise.targetReps)}
            />
          </View>
        )}
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
  return (
    <View style={{ flex: 1, alignItems: "center" }}>
      <Text
        style={{
          color: "#555",
          fontSize: 10,
          fontFamily: "Inter_400Regular",
          letterSpacing: 0.5,
          textTransform: "uppercase",
          marginBottom: 6,
        }}
      >
        {label}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        onBlur={onBlur}
        keyboardType="number-pad"
        placeholder={placeholder}
        placeholderTextColor="#444"
        style={{
          backgroundColor: "#111",
          borderRadius: 8,
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.06)",
          color: "#fff",
          fontFamily: "Inter_600SemiBold",
          fontSize: 16,
          paddingVertical: 8,
          width: "100%",
          textAlign: "center",
        }}
      />
    </View>
  );
}
