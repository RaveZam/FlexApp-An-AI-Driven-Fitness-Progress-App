import "@/global.css";
import { FontFamilies } from "@/constants/theme";
import { usePalette, type Palette } from "@/src/theme";
import { LinearGradient } from "expo-linear-gradient";
import { useMemo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { DayChipsEditor } from "../components/DayChipsEditor";
import { ExerciseMuscleGroup } from "../components/ExerciseMuscleGroup";
import { ExercisePickerModal } from "../components/ExercisePickerModal";
import { WorkoutDetailHeader } from "../components/WorkoutDetailHeader";
import { WorkoutDetailMasthead } from "../components/WorkoutDetailMasthead";
import { WorkoutEditActions } from "../components/WorkoutEditActions";
import { EmptyState } from "../../components/EmptyState";
import { useWorkoutDetailScreen } from "../hooks/useWorkoutDetailScreen";

export default function WorkoutDetailScreen() {
  const p = usePalette();
  const styles = useMemo(() => makeStyles(p), [p]);
  const {
    workout,
    editing,
    goBack,
    toggleEditing,
    refreshDays,
    groups,
    showHeaders,
    selectedIds,
    toggleSelect,
    removeSelected,
    updateTargets,
    pickerVisible,
    openPicker,
    closePicker,
    pickExercise,
  } = useWorkoutDetailScreen();

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <LinearGradient
        colors={[p.accentSoft, "transparent"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 0.32 }}
        style={StyleSheet.absoluteFillObject}
        pointerEvents="none"
      />

      <View style={styles.container}>
        <WorkoutDetailHeader
          editing={editing}
          onBack={goBack}
          onToggleEdit={toggleEditing}
        />

        {!workout ? (
          <View style={styles.notFound}>
            <EmptyState title="Workout not found" />
          </View>
        ) : (
          <>
            <WorkoutDetailMasthead workout={workout} editing={editing} />

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
                    onSaved={refreshDays}
                  />
                </Animated.View>
              )}

              <Animated.View entering={FadeInDown.delay(120).duration(420)}>
                <Text style={styles.sectionLabel}>Exercises</Text>

                {groups.length === 0 ? (
                  <Animated.View
                    entering={FadeInDown.delay(160).duration(420)}
                    style={styles.empty}
                  >
                    <EmptyState
                      title="No exercises yet"
                      body={
                        editing
                          ? `Tap “Add Exercise” below\nto build out this workout.`
                          : undefined
                      }
                    />
                  </Animated.View>
                ) : (
                  <View style={styles.groups}>
                    {groups.map((group) => (
                      <ExerciseMuscleGroup
                        key={group.muscle}
                        group={group}
                        showHeader={showHeaders}
                        editing={editing}
                        selectedIds={selectedIds}
                        onToggle={toggleSelect}
                        onUpdateTargets={updateTargets}
                      />
                    ))}
                  </View>
                )}

                {editing && (
                  <WorkoutEditActions
                    selectedCount={selectedIds.size}
                    onAddExercise={openPicker}
                    onRemoveSelected={removeSelected}
                  />
                )}
              </Animated.View>
            </ScrollView>

            <ExercisePickerModal
              visible={pickerVisible}
              onSelect={pickExercise}
              onClose={closePicker}
            />
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const makeStyles = (p: Palette) =>
  StyleSheet.create({
    safe: { flex: 1, backgroundColor: p.ink },
    container: { flex: 1, backgroundColor: "transparent" },

    hairline: {
      marginHorizontal: 20,
      height: StyleSheet.hairlineWidth,
      backgroundColor: p.hairlineStrong,
    },

    scrollContent: {
      paddingHorizontal: 20,
      paddingTop: 18,
      paddingBottom: 32,
      gap: 22,
    },

    sectionLabel: {
      color: p.muted,
      fontSize: 10,
      fontFamily: FontFamilies.medium,
      letterSpacing: 2.4,
      textTransform: "uppercase",
      marginBottom: 14,
    },
    groups: { gap: 22 },

    notFound: { flex: 1, alignItems: "center", justifyContent: "center" },
    empty: { paddingTop: 40, alignItems: "center" },
  });
