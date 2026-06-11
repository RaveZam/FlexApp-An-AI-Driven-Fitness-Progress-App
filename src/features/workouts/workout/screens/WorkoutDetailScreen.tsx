import "@/global.css";
import { FontFamilies, Palette } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { ExercisePickerModal } from "../components/ExercisePickerModal";
import { DayChipsEditor } from "../components/DayChipsEditor";
import { ExerciseRow } from "../components/ExerciseRow";
import { WorkoutDetailHeader } from "../components/WorkoutDetailHeader";
import { useEditWorkoutExercises } from "../hooks/useEditWorkoutExercises";
import { useWorkouts } from "../hooks/useWorkouts";
import type { Exercise } from "../../types";

// Group exercises by muscle group, ordered by first appearance (position-sorted).
function groupByMuscle(exercises: Exercise[]) {
  const sorted = [...exercises].sort((a, b) => a.position - b.position);
  const groups: { muscle: string; items: Exercise[] }[] = [];
  for (const exercise of sorted) {
    const muscle = exercise.muscleGroup?.trim() || "Other";
    const existing = groups.find(
      (g) => g.muscle.toLowerCase() === muscle.toLowerCase()
    );
    if (existing) existing.items.push(exercise);
    else groups.push({ muscle, items: [exercise] });
  }
  return groups;
}

function titleCase(value: string) {
  return value.replace(/\b\w/g, (c) => c.toUpperCase());
}

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
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <LinearGradient
        colors={["rgba(52,211,153,0.08)", "transparent"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 0.32 }}
        style={StyleSheet.absoluteFillObject}
        pointerEvents="none"
      />

      <View style={styles.container}>
        <WorkoutDetailHeader
          editing={editing}
          onBack={() => (editing ? setEditing(false) : router.back())}
          onToggleEdit={() => setEditing((e) => !e)}
        />

        {!workout ? (
          <View style={styles.notFound}>
            <View style={styles.emptyGlyph}>
              <Ionicons name="barbell-outline" size={26} color={Palette.muted} />
            </View>
            <Text style={styles.emptyTitle}>Workout not found</Text>
          </View>
        ) : (
          <>
            <Animated.View
              entering={FadeInDown.delay(40).duration(420)}
              style={styles.masthead}
            >
              <Text style={styles.eyebrow}>
                {editing ? "Editing" : "Workout"}
              </Text>
              <Text style={styles.title} numberOfLines={2}>
                {workout.name}
              </Text>
              <View style={styles.statRow}>
                <Ionicons name="barbell-outline" size={13} color={Palette.muted} />
                <Text style={styles.statText}>
                  {workout.exercises.length} exercise
                  {workout.exercises.length !== 1 ? "s" : ""}
                </Text>
              </View>
            </Animated.View>

            <View style={styles.hairline} />

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
            >
              {!editing && (
                <Animated.View entering={FadeInDown.delay(80).duration(420)}>
                  <DayChipsEditor
                    workoutId={workout.id}
                    initialDays={workout.daysOfWeek}
                    onSaved={refresh}
                  />
                </Animated.View>
              )}

              <Animated.View entering={FadeInDown.delay(120).duration(420)}>
                <Text style={styles.sectionLabel}>Exercises</Text>

                {workout.exercises.length === 0 ? (
                  <Animated.View
                    entering={FadeInDown.delay(160).duration(420)}
                    style={styles.empty}
                  >
                    <View style={styles.emptyGlyph}>
                      <Ionicons name="barbell-outline" size={26} color={Palette.muted} />
                    </View>
                    <Text style={styles.emptyTitle}>No exercises yet</Text>
                    {editing && (
                      <Text style={styles.emptyBody}>
                        Tap “Add Exercise” below{"\n"}to build out this workout.
                      </Text>
                    )}
                  </Animated.View>
                ) : (
                  (() => {
                    const groups = groupByMuscle(workout.exercises);
                    const showHeaders =
                      groups.length > 1 || groups[0]?.muscle !== "Other";
                    let offset = 0;
                    return (
                      <View style={styles.groups}>
                        {groups.map((group) => {
                          const base = offset;
                          offset += group.items.length;
                          return (
                            <View key={group.muscle} style={styles.group}>
                              {showHeaders && (
                                <View style={styles.groupHeader}>
                                  <Text style={styles.groupTitle}>
                                    {titleCase(group.muscle)}
                                  </Text>
                                  <View style={styles.groupLine} />
                                  <Text style={styles.groupCount}>
                                    {group.items.length}
                                  </Text>
                                </View>
                              )}
                              <View style={styles.list}>
                                {group.items.map((exercise, j) => (
                                  <ExerciseRow
                                    key={exercise.id}
                                    exercise={exercise}
                                    index={base + j}
                                    editing={editing}
                                    selected={selectedIds.has(exercise.id)}
                                    onToggle={() => toggleSelect(exercise.id)}
                                    onUpdateTargets={(sets, reps) =>
                                      updateTargets(exercise.id, sets, reps)
                                    }
                                  />
                                ))}
                              </View>
                            </View>
                          );
                        })}
                      </View>
                    );
                  })()
                )}

                {editing && (
                  <View style={styles.actions}>
                    <Pressable
                      onPress={() => setPickerVisible(true)}
                      style={styles.addButton}
                    >
                      <Ionicons name="add" size={18} color={Palette.accent} />
                      <Text style={styles.addText}>Add Exercise</Text>
                    </Pressable>

                    {selectedIds.size > 0 && (
                      <Pressable
                        onPress={removeSelected}
                        style={styles.removeButton}
                      >
                        <Ionicons name="trash-outline" size={16} color={Palette.danger} />
                        <Text style={styles.removeText}>
                          Remove {selectedIds.size} Exercise
                          {selectedIds.size > 1 ? "s" : ""}
                        </Text>
                      </Pressable>
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

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Palette.ink },
  container: { flex: 1, backgroundColor: "transparent" },

  masthead: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 18 },
  eyebrow: {
    color: Palette.accent,
    fontSize: 10,
    fontFamily: FontFamilies.medium,
    letterSpacing: 3,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  title: {
    color: Palette.bone,
    fontSize: 34,
    fontFamily: FontFamilies.displayLight,
    letterSpacing: -0.8,
    lineHeight: 38,
  },
  statRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 14,
  },
  statText: {
    color: Palette.muted,
    fontSize: 12.5,
    fontFamily: FontFamilies.regular,
    letterSpacing: 0.2,
  },

  hairline: {
    marginHorizontal: 20,
    height: StyleSheet.hairlineWidth,
    backgroundColor: Palette.hairlineStrong,
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 32,
    gap: 22,
  },

  sectionLabel: {
    color: Palette.muted,
    fontSize: 10,
    fontFamily: FontFamilies.medium,
    letterSpacing: 2.4,
    textTransform: "uppercase",
    marginBottom: 14,
  },
  list: { gap: 8 },

  groups: { gap: 22 },
  group: { gap: 11 },
  groupHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  groupTitle: {
    color: Palette.muted,
    fontSize: 10,
    fontFamily: FontFamilies.medium,
    letterSpacing: 2.4,
    textTransform: "uppercase",
  },
  groupLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: Palette.hairline,
  },
  groupCount: {
    color: Palette.mutedSoft,
    fontSize: 11,
    fontFamily: FontFamilies.regular,
  },

  actions: { marginTop: 16, gap: 10 },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: Palette.accentSoft,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Palette.accentBorder,
  },
  addText: {
    color: Palette.accent,
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
    backgroundColor: "rgba(248,113,113,0.08)",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(248,113,113,0.35)",
  },
  removeText: {
    color: Palette.danger,
    fontSize: 12,
    fontFamily: FontFamilies.displayMedium,
    letterSpacing: 1.6,
    textTransform: "uppercase",
  },

  notFound: { flex: 1, alignItems: "center", justifyContent: "center" },
  empty: { paddingTop: 40, alignItems: "center" },
  emptyGlyph: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Palette.hairlineStrong,
    backgroundColor: Palette.inkRaised,
    marginBottom: 18,
  },
  emptyTitle: {
    color: Palette.bone,
    fontSize: 18,
    fontFamily: FontFamilies.displayMedium,
    letterSpacing: -0.3,
    marginBottom: 7,
  },
  emptyBody: {
    color: Palette.muted,
    fontSize: 13,
    fontFamily: FontFamilies.regular,
    textAlign: "center",
    lineHeight: 19,
  },
});
