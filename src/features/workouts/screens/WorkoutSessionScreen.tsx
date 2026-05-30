import ExercisesListSheet from "@/src/features/workouts/components/session/ExercisesListSheet";
import RestTimerModal from "@/src/features/workouts/components/session/RestTimerModal";
import SessionBottomBar from "@/src/features/workouts/components/session/SessionBottomBar";
import SessionExerciseCard from "@/src/features/workouts/components/session/SessionExerciseCard";
import SessionHeader from "@/src/features/workouts/components/session/SessionHeader";
import SessionStatsPanel from "@/src/features/workouts/components/session/SessionStatsPanel";
import SessionTimerHero from "@/src/features/workouts/components/session/SessionTimerHero";
import SetRow from "@/src/features/workouts/components/session/SetRow";
import WorkoutLogModal from "@/src/features/workouts/components/session/WorkoutLogModal";
import { useActiveSession } from "@/src/features/workouts/hooks/useActiveSession";
import { useExerciseHistory } from "@/src/features/workouts/hooks/useExerciseHistory";
import { useRestTimerDefault } from "@/src/features/workouts/hooks/useRestTimerDefault";
import { useSessionGuard } from "@/src/features/workouts/hooks/useSessionGuard";
import { useWorkoutSession } from "@/src/features/workouts/hooks/useWorkoutSession";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const ACCENT = "#34d399";
const BONE = "#f5f3ef";
const HAIRLINE = "rgba(245,243,239,0.07)";
const INK = "#060606";
const MUTED = "#6b6b6b";

export default function WorkoutSessionScreen() {
  const { id: sessionId } = useLocalSearchParams<{ id?: string }>();
  const { restSeconds, setRestSeconds } = useRestTimerDefault();
  const { refresh: refreshActiveSession } = useActiveSession();
  const {
    exercises,
    activeIndex,
    setActiveIndex,
    active,
    currentSetIndex,
    allSetsComplete,
    allExercisesComplete,
    elapsedSeconds,
    logSet,
    editSet,
    goToNextExercise,
    finish,
    cancel,
  } = useWorkoutSession(sessionId);

  useSessionGuard(sessionId);

  const [showLogModal, setShowLogModal] = useState(false);
  const [showRestTimer, setShowRestTimer] = useState(false);
  const [showExercisesList, setShowExercisesList] = useState(false);
  const [editingSetId, setEditingSetId] = useState<string | null>(null);

  const editingSet = editingSetId
    ? active?.sets.find((s) => s.id === editingSetId) ?? null
    : null;

  function handleEditSave(weight: number, reps: number) {
    if (!editingSetId) return;
    editSet(editingSetId, weight, reps);
    setEditingSetId(null);
  }

  const completedSetCount = exercises.reduce(
    (acc, ex) => acc + ex.sets.filter((s) => s.completed).length,
    0
  );
  const { best, recentSessions } = useExerciseHistory(active?.name, completedSetCount);

  useEffect(() => {
    if (!active) router.back();
  }, [active]);

  if (!active) return null;

  function handleLog(weight: number, reps: number) {
    const incomplete = exercises.reduce(
      (acc, ex) => acc + ex.sets.filter((s) => !s.completed).length,
      0
    );
    const isLastSet = incomplete === 1;
    logSet(weight, reps);
    setShowLogModal(false);
    if (!isLastSet) setShowRestTimer(true);
  }

  function handleExit() {
    Alert.alert("Cancel Workout?", "Your progress will not be saved.", [
      { text: "Keep Going", style: "cancel" },
      {
        text: "Cancel Workout",
        style: "destructive",
        onPress: () => {
          cancel();
          refreshActiveSession();
          router.back();
        },
      },
    ]);
  }

  function handleFinish() {
    finish();
    refreshActiveSession();
    router.back();
  }

  const bottomMode = allExercisesComplete ? "finish" : allSetsComplete ? "next" : "log";
  const bottomAction =
    bottomMode === "finish"
      ? handleFinish
      : bottomMode === "next"
      ? goToNextExercise
      : () => setShowLogModal(true);

  const progressPct = exercises.length
    ? ((activeIndex + (allSetsComplete ? 1 : 0)) / exercises.length) * 100
    : 0;

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
          onShowExercises={() => setShowExercisesList(true)}
        />

        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progressPct}%` }]} />
        </View>

        <SessionTimerHero elapsedSeconds={elapsedSeconds} restSeconds={restSeconds} />

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <SessionExerciseCard
            name={active.name}
            setCount={active.sets.length}
            targetReps={active.sets[0]?.targetReps}
          />

          <SessionStatsPanel
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
                key={set.id}
                set={set}
                isCurrent={index === currentSetIndex}
                index={index}
                onEdit={(id) => setEditingSetId(id)}
              />
            ))}
          </View>

          {allSetsComplete && !allExercisesComplete && (
            <Animated.View entering={FadeInDown.delay(80).duration(400)} style={styles.doneCard}>
              <View style={styles.doneIconRing}>
                <Ionicons name="checkmark" size={22} color={ACCENT} />
              </View>
              <Text style={styles.doneText}>All sets complete</Text>
              <Text style={styles.doneSub}>Ready for the next lift</Text>
            </Animated.View>
          )}

          {allExercisesComplete && (
            <Animated.View entering={FadeInDown.delay(80).duration(400)} style={styles.doneCard}>
              <View style={styles.doneIconRing}>
                <Ionicons name="trophy" size={22} color={ACCENT} />
              </View>
              <Text style={styles.doneText}>Workout Complete</Text>
              <Text style={styles.doneSub}>Lock it in</Text>
            </Animated.View>
          )}
        </ScrollView>

        <SessionBottomBar mode={bottomMode} onPress={bottomAction} />

        <RestTimerModal
          visible={showRestTimer}
          onClose={() => setShowRestTimer(false)}
          durationSeconds={restSeconds}
          onSaveAsDefault={setRestSeconds}
        />

        <WorkoutLogModal
          visible={showLogModal}
          exerciseName={active.name}
          setNumber={allSetsComplete ? active.sets.length : currentSetIndex + 1}
          totalSets={active.sets.length}
          targetReps={allSetsComplete ? 0 : active.sets[currentSetIndex]?.targetReps ?? 0}
          onLog={handleLog}
          onClose={() => setShowLogModal(false)}
        />

        <WorkoutLogModal
          visible={!!editingSet}
          exerciseName={active.name}
          setNumber={editingSet?.setNumber ?? 0}
          totalSets={active.sets.length}
          targetReps={editingSet?.targetReps ?? 0}
          mode="edit"
          initialWeight={editingSet?.weight ?? null}
          initialReps={editingSet?.actualReps ?? null}
          onLog={handleEditSave}
          onClose={() => setEditingSetId(null)}
        />

        <ExercisesListSheet
          visible={showExercisesList}
          exercises={exercises}
          activeIndex={activeIndex}
          onSelect={(i) => {
            setActiveIndex(i);
            setShowExercisesList(false);
          }}
          onClose={() => setShowExercisesList(false)}
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

  doneCard: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 26,
    marginHorizontal: 20,
    paddingVertical: 28,
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(52,211,153,0.25)",
    backgroundColor: "rgba(52,211,153,0.03)",
    gap: 8,
  },
  doneIconRing: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(52,211,153,0.5)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  doneText: {
    color: BONE,
    fontSize: 18,
    fontFamily: "Outfit_500Medium",
    letterSpacing: -0.2,
  },
  doneSub: {
    color: MUTED,
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    letterSpacing: 1.4,
    textTransform: "uppercase",
  },
});
