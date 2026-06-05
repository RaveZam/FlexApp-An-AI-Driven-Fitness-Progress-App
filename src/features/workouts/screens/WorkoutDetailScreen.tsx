import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { ExercisePickerModal } from "../components/create/ExercisePickerModal";
import { DayChipsEditor } from "../components/detail/DayChipsEditor";
import { ExerciseRow } from "../components/detail/ExerciseRow";
import { WorkoutDetailHeader } from "../components/detail/WorkoutDetailHeader";
import { useEditWorkoutExercises } from "../hooks/useEditWorkoutExercises";
import { useWorkouts } from "../hooks/useWorkouts";
import "@/global.css";

export default function WorkoutDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { workouts, refresh, refreshLocal } = useWorkouts();
  const [editing, setEditing] = useState(false);

  const workout = workouts.find((w) => w.id === id);

  const {
    selectedIds,
    toggleSelect,
    removeSelected,
    updateTargets,
    pickerVisible,
    setPickerVisible,
    addExercise,
  } = useEditWorkoutExercises(id ?? "", workout?.exercises ?? [], refreshLocal);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0f0f0f" }} edges={["top"]}>
      <View style={{ flex: 1, backgroundColor: "#0f0f0f" }}>
        <WorkoutDetailHeader
          title={workout?.name ?? "Workout"}
          editing={editing}
          onBack={() => (editing ? setEditing(false) : router.back())}
          onToggleEdit={() => setEditing((e) => !e)}
        />

        {!workout ? (
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 8 }}>
            <Ionicons name="barbell-outline" size={32} color="#333" />
            <Text style={{ color: "#444", fontSize: 13, fontFamily: "Inter_400Regular" }}>
              Workout not found.
            </Text>
          </View>
        ) : (
          <>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32, gap: 20 }}
            >
              {!editing && (
                <Animated.View entering={FadeInDown.delay(40).duration(400)}>
                  <DayChipsEditor
                    workoutId={workout.id}
                    initialDays={workout.daysOfWeek}
                    onSaved={refresh}
                  />
                </Animated.View>
              )}

              <Animated.View entering={FadeInDown.delay(80).duration(400)}>
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 14 }}
                >
                  <View
                    style={{ width: 4, height: 18, borderRadius: 2, backgroundColor: "#10b981" }}
                  />
                  <Text
                    style={{
                      color: "#ffffff",
                      fontSize: 13,
                      fontFamily: "Inter_500Medium",
                      letterSpacing: 0.8,
                      textTransform: "uppercase",
                    }}
                  >
                    Exercises
                  </Text>
                  <Text
                    style={{
                      color: "#444",
                      fontSize: 11,
                      fontFamily: "Inter_400Regular",
                      marginLeft: "auto",
                    }}
                  >
                    {workout.exercises.length} total
                  </Text>
                </View>

                {workout.exercises.length === 0 ? (
                  <Animated.View
                    entering={FadeInDown.delay(120).duration(400)}
                    style={{ paddingTop: 40, alignItems: "center", gap: 8 }}
                  >
                    <Ionicons name="barbell-outline" size={28} color="#333" />
                    <Text
                      style={{
                        color: "#444",
                        fontSize: 13,
                        fontFamily: "Inter_400Regular",
                        textAlign: "center",
                      }}
                    >
                      No exercises in this workout.
                    </Text>
                  </Animated.View>
                ) : (
                  <View style={{ gap: 8 }}>
                    {workout.exercises
                      .slice()
                      .sort((a, b) => a.position - b.position)
                      .map((exercise, index) => (
                        <ExerciseRow
                          key={exercise.id}
                          exercise={exercise}
                          index={index}
                          editing={editing}
                          selected={selectedIds.has(exercise.id)}
                          onToggle={() => toggleSelect(exercise.id)}
                          onUpdateTargets={(sets, reps) => updateTargets(exercise.id, sets, reps)}
                        />
                      ))}
                  </View>
                )}

                {editing && (
                  <View style={{ marginTop: 16, gap: 10 }}>
                    <TouchableOpacity
                      onPress={() => setPickerVisible(true)}
                      activeOpacity={0.7}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                        paddingVertical: 14,
                        borderRadius: 12,
                        backgroundColor: "rgba(16,185,129,0.1)",
                        borderWidth: 1,
                        borderColor: "rgba(16,185,129,0.3)",
                      }}
                    >
                      <Ionicons name="add" size={18} color="#10b981" />
                      <Text style={{ color: "#10b981", fontSize: 14, fontFamily: "Inter_500Medium" }}>
                        Add Exercise
                      </Text>
                    </TouchableOpacity>

                    {selectedIds.size > 0 && (
                      <TouchableOpacity
                        onPress={removeSelected}
                        activeOpacity={0.7}
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 8,
                          paddingVertical: 14,
                          borderRadius: 12,
                          backgroundColor: "rgba(239,68,68,0.1)",
                          borderWidth: 1,
                          borderColor: "rgba(239,68,68,0.3)",
                        }}
                      >
                        <Ionicons name="trash-outline" size={16} color="#ef4444" />
                        <Text style={{ color: "#ef4444", fontSize: 14, fontFamily: "Inter_500Medium" }}>
                          Remove {selectedIds.size} Exercise{selectedIds.size > 1 ? "s" : ""}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )}
              </Animated.View>
            </ScrollView>

            <ExercisePickerModal
              visible={pickerVisible}
              onSelect={(catalog) => {
                addExercise(catalog);
                setPickerVisible(false);
              }}
              onClose={() => setPickerVisible(false)}
            />
          </>
        )}
      </View>
    </SafeAreaView>
  );
}
