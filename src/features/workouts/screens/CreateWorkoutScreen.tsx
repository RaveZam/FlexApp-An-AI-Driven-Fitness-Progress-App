import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown, FadeInRight } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { ExercisePickerModal } from "../components/ExercisePickerModal";
import { useCreateWorkout } from "../hooks/useCreateWorkout";
import type { CatalogExercise } from "../types";
import "@/global.css";

type ExerciseRow = {
  key: string;
  catalogExercise: CatalogExercise;
  targetSets: string;
  targetReps: string;
};

const DAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

let keyCounter = 0;
function newKey() {
  return String(++keyCounter);
}

export default function CreateWorkoutScreen() {
  const router = useRouter();
  const { planId } = useLocalSearchParams<{ planId: string }>();
  const { createWorkout, saving } = useCreateWorkout();

  const [workoutName, setWorkoutName] = useState("");
  const [daysOfWeek, setDaysOfWeek] = useState<number[]>([]);
  const [exercises, setExercises] = useState<ExerciseRow[]>([]);
  const [pickerVisible, setPickerVisible] = useState(false);

  function toggleDay(day: number) {
    setDaysOfWeek((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  }

  function handleSelectExercise(catalog: CatalogExercise) {
    setExercises((prev) => [
      ...prev,
      { key: newKey(), catalogExercise: catalog, targetSets: "3", targetReps: "10" },
    ]);
  }

  function handleRemove(key: string) {
    setExercises((prev) => prev.filter((e) => e.key !== key));
  }

  function handleChange(key: string, field: "targetSets" | "targetReps", value: string) {
    setExercises((prev) =>
      prev.map((e) => (e.key === key ? { ...e, [field]: value.replace(/[^0-9]/g, "") } : e))
    );
  }

  async function handleSave() {
    if (!planId) {
      Alert.alert("Error", "No plan selected.");
      return;
    }
    const name = workoutName.trim();
    if (!name) {
      Alert.alert("Name required", "Please enter a workout name.");
      return;
    }
    if (exercises.length === 0) {
      Alert.alert("No exercises", "Add at least one exercise.");
      return;
    }
    for (const e of exercises) {
      const sets = parseInt(e.targetSets, 10);
      const reps = parseInt(e.targetReps, 10);
      if (!sets || sets < 1 || !reps || reps < 1) {
        Alert.alert("Invalid sets/reps", `"${e.catalogExercise.name}" needs valid sets and reps (≥ 1).`);
        return;
      }
    }

    await createWorkout({
      planId,
      name,
      daysOfWeek,
      exercises: exercises.map((e) => ({
        catalogExerciseId: e.catalogExercise.id,
        name: e.catalogExercise.name,
        targetSets: parseInt(e.targetSets, 10),
        targetReps: parseInt(e.targetReps, 10),
      })),
    });

    router.back();
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0f0f0f" }} edges={["top"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Header */}
        <Animated.View
          entering={FadeInDown.delay(50).duration(350)}
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 20,
            paddingTop: 8,
            paddingBottom: 16,
          }}
        >
          <View style={{ flex: 1 }}>
            <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7} hitSlop={8}>
              <Ionicons name="chevron-back" size={24} color="#888" />
            </TouchableOpacity>
          </View>

          <View style={{ flex: 1, alignItems: "center" }}>
            <Text
              style={{
                color: "#fff",
                fontSize: 18,
                fontFamily: "Inter_600SemiBold",
                letterSpacing: -0.3,
              }}
            >
              New Workout
            </Text>
          </View>

          <View style={{ flex: 1, alignItems: "flex-end" }}>
            <TouchableOpacity
              onPress={handleSave}
              disabled={saving}
              activeOpacity={0.7}
              style={{
                paddingHorizontal: 14,
                paddingVertical: 8,
                borderRadius: 10,
                backgroundColor: saving ? "#1a3326" : "#1a472a",
                borderWidth: 1,
                borderColor: "rgba(16,185,129,0.2)",
              }}
            >
              <Text
                style={{
                  color: saving ? "#555" : "#10b981",
                  fontSize: 13,
                  fontFamily: "Inter_600SemiBold",
                }}
              >
                {saving ? "Saving…" : "Save"}
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40, gap: 24 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Workout name */}
          <Animated.View entering={FadeInDown.delay(100).duration(350)}>
            <Text
              style={{
                color: "#666",
                fontSize: 11,
                fontFamily: "Inter_500Medium",
                letterSpacing: 0.8,
                textTransform: "uppercase",
                marginBottom: 8,
              }}
            >
              Workout Name
            </Text>
            <TextInput
              value={workoutName}
              onChangeText={setWorkoutName}
              placeholder="e.g. Push Day, Legs"
              placeholderTextColor="#333"
              style={{
                backgroundColor: "#191919",
                borderRadius: 12,
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.06)",
                color: "#fff",
                fontFamily: "Inter_500Medium",
                fontSize: 16,
                padding: 14,
              }}
            />
          </Animated.View>

          {/* Days of week */}
          <Animated.View entering={FadeInDown.delay(140).duration(350)}>
            <Text
              style={{
                color: "#666",
                fontSize: 11,
                fontFamily: "Inter_500Medium",
                letterSpacing: 0.8,
                textTransform: "uppercase",
                marginBottom: 10,
              }}
            >
              Days
            </Text>
            <View style={{ flexDirection: "row", gap: 8 }}>
              {DAY_LABELS.map((label, i) => {
                const selected = daysOfWeek.includes(i);
                return (
                  <TouchableOpacity
                    key={i}
                    onPress={() => toggleDay(i)}
                    activeOpacity={0.7}
                    style={{
                      flex: 1,
                      aspectRatio: 1,
                      borderRadius: 10,
                      backgroundColor: selected ? "rgba(16,185,129,0.15)" : "#191919",
                      alignItems: "center",
                      justifyContent: "center",
                      borderWidth: 1,
                      borderColor: selected ? "rgba(16,185,129,0.5)" : "rgba(255,255,255,0.06)",
                    }}
                  >
                    <Text
                      style={{
                        color: selected ? "#10b981" : "#555",
                        fontSize: 12,
                        fontFamily: selected ? "Inter_600SemiBold" : "Inter_400Regular",
                      }}
                    >
                      {label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </Animated.View>

          {/* Exercises */}
          <Animated.View entering={FadeInDown.delay(180).duration(350)}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 12,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <View
                  style={{ width: 4, height: 18, borderRadius: 2, backgroundColor: "#10b981" }}
                />
                <Text
                  style={{
                    color: "#fff",
                    fontSize: 13,
                    fontFamily: "Inter_500Medium",
                    letterSpacing: 0.8,
                    textTransform: "uppercase",
                  }}
                >
                  Exercises
                </Text>
              </View>
              {exercises.length > 0 && (
                <Text style={{ color: "#444", fontSize: 12, fontFamily: "Inter_400Regular" }}>
                  {exercises.length} added
                </Text>
              )}
            </View>

            <View style={{ gap: 10 }}>
              {exercises.map((row, index) => (
                <Animated.View
                  key={row.key}
                  entering={FadeInRight.delay(index * 50).duration(400)}
                >
                  <View
                    style={{
                      backgroundColor: "#191919",
                      borderRadius: 12,
                      borderWidth: 1,
                      borderColor: "rgba(255,255,255,0.05)",
                      overflow: "hidden",
                    }}
                  >
                    {/* Exercise name row */}
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        paddingHorizontal: 14,
                        paddingVertical: 12,
                        borderBottomWidth: 1,
                        borderBottomColor: "rgba(255,255,255,0.04)",
                        gap: 10,
                      }}
                    >
                      <View
                        style={{
                          width: 22,
                          height: 22,
                          borderRadius: 11,
                          backgroundColor: "rgba(16,185,129,0.12)",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Text
                          style={{ color: "#10b981", fontSize: 11, fontFamily: "Inter_600SemiBold" }}
                        >
                          {index + 1}
                        </Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text
                          style={{
                            color: "#fff",
                            fontSize: 14,
                            fontFamily: "Inter_500Medium",
                          }}
                        >
                          {row.catalogExercise.name}
                        </Text>
                        {row.catalogExercise.muscleGroup && (
                          <Text
                            style={{
                              color: "#555",
                              fontSize: 11,
                              fontFamily: "Inter_400Regular",
                              marginTop: 2,
                              textTransform: "capitalize",
                            }}
                          >
                            {row.catalogExercise.muscleGroup}
                          </Text>
                        )}
                      </View>
                      <TouchableOpacity onPress={() => handleRemove(row.key)} hitSlop={8}>
                        <Ionicons name="trash-outline" size={16} color="#444" />
                      </TouchableOpacity>
                    </View>

                    {/* Sets / Reps */}
                    <View
                      style={{ flexDirection: "row", paddingHorizontal: 14, paddingVertical: 10, gap: 12 }}
                    >
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
                          Sets
                        </Text>
                        <TextInput
                          value={row.targetSets}
                          onChangeText={(v) => handleChange(row.key, "targetSets", v)}
                          keyboardType="number-pad"
                          placeholder="3"
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
                      <View
                        style={{
                          width: 1,
                          alignSelf: "stretch",
                          backgroundColor: "rgba(255,255,255,0.04)",
                          marginVertical: 4,
                        }}
                      />
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
                          Reps
                        </Text>
                        <TextInput
                          value={row.targetReps}
                          onChangeText={(v) => handleChange(row.key, "targetReps", v)}
                          keyboardType="number-pad"
                          placeholder="10"
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
                    </View>
                  </View>
                </Animated.View>
              ))}
            </View>

            <TouchableOpacity
              onPress={() => setPickerVisible(true)}
              activeOpacity={0.7}
              style={{
                marginTop: exercises.length > 0 ? 12 : 0,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                paddingVertical: 14,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: "rgba(16,185,129,0.2)",
                borderStyle: "dashed",
              }}
            >
              <Ionicons name="add" size={16} color="#10b981" />
              <Text
                style={{
                  color: "#10b981",
                  fontSize: 13,
                  fontFamily: "Inter_500Medium",
                  letterSpacing: 0.3,
                }}
              >
                Add Exercise
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>

      <ExercisePickerModal
        visible={pickerVisible}
        onSelect={handleSelectExercise}
        onClose={() => setPickerVisible(false)}
      />
    </SafeAreaView>
  );
}
