import ExercisesListSheet from "@/src/features/workouts/session/components/ExercisesListSheet";
import RestTimerModal from "@/src/features/workouts/session/components/RestTimerModal";
import SessionBottomBar from "@/src/features/workouts/session/components/SessionBottomBar";
import SessionCompleteCard from "@/src/features/workouts/session/components/SessionCompleteCard";
import SessionExerciseCard from "@/src/features/workouts/session/components/SessionExerciseCard";
import SessionHeader from "@/src/features/workouts/session/components/SessionHeader";
import SessionStatsPanel from "@/src/features/workouts/session/components/SessionStatsPanel";
import SessionTimerHero from "@/src/features/workouts/session/components/SessionTimerHero";
import SetRow from "@/src/features/workouts/session/components/SetRow";
import { useExerciseList } from "@/src/features/workouts/session/hooks/useExerciseList";
import { useRestTimer } from "@/src/features/workouts/session/hooks/useRestTimer";
import { useWorkoutSession } from "@/src/features/workouts/session/hooks/useWorkoutSession";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ACCENT = "#34d399";
const HAIRLINE = "rgba(245,243,239,0.07)";
const INK = "#060606";
const MUTED = "#6b6b6b";

export default function WorkoutSessionScreen() {
  const { id: sessionId } = useLocalSearchParams<{ id?: string }>();
  const { showRestTimer, openRestTimer, closeRestTimer } = useRestTimer();
  const {
    // loading,

    // active,
    exercises,
    activeIndex,
    // currentSetIndex,
    // allSetsComplete,
    // allExercisesComplete,

    // best,
    // recentSessions,
    // progressPct,

    // bottomMode,
    // bottomAction,
    // editingSet,

    // All States that control UI
    // showLogModal,
    // handleLog,
    // handleEditSave,
    // handleExit,
    goToExercise,
    // openEditSet,
    // closeEditSet,
    // closeLogModal,
  } = useWorkoutSession(sessionId, { onRestNeeded: openRestTimer });

  const { showExercisesList, openExercisesList, closeExercisesList, selectExercise } =
    useExerciseList(goToExercise);

  // Bump on every focus so the entering animations replay each time the screen
  // refocuses (entering fires only on mount, so we remount via key).
  const [focusKey, setFocusKey] = React.useState(0);
  useFocusEffect(
    React.useCallback(() => {
      setFocusKey((k) => k + 1);
    }, [])
  );

  if (loading || !active) return null;

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <LinearGradient
        colors={["rgba(52,211,153,0.08)", "transparent"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 0.4 }}
        style={StyleSheet.absoluteFillObject}
        pointerEvents="none"
      />

      <View style={styles.container}>
        <SessionHeader
          activeIndex={activeIndex}
          totalExercises={exercises.length}
          onExit={handleExit}
          onShowExercises={openExercisesList}
        />

        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progressPct}%` }]} />
        </View>

        <SessionTimerHero sessionId={sessionId} />

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <SessionExerciseCard
            key={`exercise-${focusKey}`}
            name={active.name}
            setCount={active.sets.length}
            targetReps={active.sets[0]?.targetReps}
          />

          <SessionStatsPanel
            key={`stats-${focusKey}`}
            best={best}
            recentSessions={recentSessions}
            activeExerciseId={active.id}
          />

          <View style={styles.setsHeader}>
            <Text style={styles.sectionLabel}>Sets</Text>
            <Text style={styles.setsCounter}>
              {active.sets.filter((s) => s.completed).length} / {active.sets.length}
            </Text>
          </View>
          <View style={styles.setsContainer}>
            {active.sets.map((set, index) => (
              <SetRow
                key={`${set.id}-${focusKey}`}
                set={set}
                isCurrent={index === currentSetIndex}
                index={index}
                onEdit={openEditSet}
              />
            ))}
          </View>

          {allSetsComplete && !allExercisesComplete && (
            <SessionCompleteCard
              key={`sets-done-${focusKey}`}
              icon="checkmark"
              title="All sets complete"
              subtitle="Ready for the next lift"
            />
          )}

          {allExercisesComplete && (
            <SessionCompleteCard
              key={`workout-done-${focusKey}`}
              icon="trophy"
              title="Workout Complete"
              subtitle="Lock it in"
            />
          )}
        </ScrollView>

        <SessionBottomBar mode={bottomMode} onPress={bottomAction} />

        <RestTimerModal visible={showRestTimer} onClose={closeRestTimer} />

        {/* <WorkoutLogModal
          visible={showLogModal}
          exerciseName={active.name}
          setNumber={allSetsComplete ? active.sets.length : currentSetIndex + 1}
          totalSets={active.sets.length}
          targetReps={allSetsComplete ? 0 : active.sets[currentSetIndex]?.targetReps ?? 0}
          isUnilateral={active.isUnilateral}
          onLog={handleLog}
          onClose={closeLogModal}
        />

        <WorkoutLogModal
          visible={!!editingSet}
          exerciseName={active.name}
          setNumber={editingSet?.setNumber ?? 0}
          totalSets={active.sets.length}
          targetReps={editingSet?.targetReps ?? 0}
          isUnilateral={active.isUnilateral}
          mode="edit"
          initialWeight={editingSet?.weight ?? null}
          initialReps={editingSet?.actualReps ?? null}
          initialLeftReps={editingSet?.actualRepsLeft ?? null}
          initialRightReps={editingSet?.actualRepsRight ?? null}
          onLog={handleEditSave}
          onClose={closeEditSet}
        /> */}

        <ExercisesListSheet
          visible={showExercisesList}
          exercises={exercises}
          activeIndex={activeIndex}
          onSelect={selectExercise}
          onClose={closeExercisesList}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: INK },
  container: { flex: 1, backgroundColor: "transparent" },

  progressTrack: {
    height: 1,
    marginHorizontal: 24,
    backgroundColor: HAIRLINE,
    overflow: "hidden",
  },
  progressFill: { height: "100%", backgroundColor: ACCENT },

  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 32 },

  sectionLabel: {
    color: MUTED,
    fontSize: 9,
    fontFamily: "Inter_500Medium",
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 12,
  },

  setsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: 26,
    marginBottom: 14,
  },
  setsCounter: {
    color: MUTED,
    fontSize: 11,
    fontFamily: "Outfit_400Regular",
    fontVariant: ["tabular-nums"],
    letterSpacing: 0.4,
  },
  setsContainer: { paddingHorizontal: 20, gap: 10 },
});
