import ExercisesListSheet from "@/src/features/workouts/components/session/ExercisesListSheet";
import RestTimerModal from "@/src/features/workouts/components/session/RestTimerModal";
import SetRow from "@/src/features/workouts/components/session/SetRow";
import WorkoutLogModal from "@/src/features/workouts/components/session/WorkoutLogModal";
import { useWorkoutSession } from "@/src/features/workouts/hooks/useWorkoutSession";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const ACCENT = "#10b981";

function formatTime(totalSec: number): string {
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export default function WorkoutSessionScreen() {
  const { id: sessionId } = useLocalSearchParams<{ id?: string }>();
  const {
    name,
    exercises,
    activeIndex,
    setActiveIndex,
    active,
    currentSetIndex,
    allSetsComplete,
    allExercisesComplete,
    elapsedSeconds,
    logSet,
    goToNextExercise,
    finish,
  } = useWorkoutSession(sessionId);

  const [showLogModal, setShowLogModal] = useState(false);
  const [showRestTimer, setShowRestTimer] = useState(false);
  const [showExercisesList, setShowExercisesList] = useState(false);

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

  function handleFinish() {
    finish();
    router.back();
  }

  let bottomText = "Log Set";
  let bottomAction: () => void = () => setShowLogModal(true);
  if (allExercisesComplete) {
    bottomText = "Finish Workout";
    bottomAction = handleFinish;
  } else if (allSetsComplete) {
    bottomText = "Next Exercise";
    bottomAction = goToNextExercise;
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.container}>
        <Animated.View entering={FadeIn.duration(300)} style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
            <Text style={styles.headerAction}>Exit</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            Workout {activeIndex + 1}/{exercises.length}
          </Text>
          <TouchableOpacity onPress={() => setShowExercisesList(true)} activeOpacity={0.7}>
            <Text style={styles.headerAction}>Exercises</Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(60).duration(300)} style={styles.timerBar}>
          <View>
            <Text style={styles.timerLabel}>Time:</Text>
            <Text style={styles.timerValue}>{formatTime(elapsedSeconds)}</Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={styles.timerLabel}>Rest Time:</Text>
            <Text style={styles.timerValueWhite}>
              {Math.floor(active.restSeconds / 60)}:
              {(active.restSeconds % 60).toString().padStart(2, "0")}
            </Text>
          </View>
        </Animated.View>

        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Animated.View entering={FadeInDown.delay(120).duration(400)} style={styles.exerciseCard}>
            <View style={styles.exerciseImagePlaceholder}>
              <Ionicons name="barbell" size={32} color={ACCENT} />
            </View>
            <Text style={styles.exerciseName}>{active.name}</Text>
          </Animated.View>

          <View style={styles.setsContainer}>
            {active.sets.map((set, index) => (
              <SetRow key={set.id} set={set} isCurrent={index === currentSetIndex} index={index} />
            ))}
          </View>

          {allSetsComplete && !allExercisesComplete && (
            <Animated.View entering={FadeInDown.delay(100).duration(400)} style={styles.doneCard}>
              <Ionicons name="checkmark-circle" size={32} color={ACCENT} />
              <Text style={styles.doneText}>All sets complete!</Text>
            </Animated.View>
          )}

          {allExercisesComplete && (
            <Animated.View entering={FadeInDown.delay(100).duration(400)} style={styles.doneCard}>
              <Ionicons name="trophy" size={36} color={ACCENT} />
              <Text style={styles.doneText}>Workout Complete!</Text>
            </Animated.View>
          )}
        </ScrollView>

        <Animated.View entering={FadeInDown.delay(300).duration(400)} style={styles.bottomArea}>
          <TouchableOpacity activeOpacity={0.85} onPress={bottomAction} style={styles.bottomButton}>
            <Text style={styles.bottomButtonText}>{bottomText}</Text>
          </TouchableOpacity>
        </Animated.View>

        <RestTimerModal
          visible={showRestTimer}
          onClose={() => setShowRestTimer(false)}
          durationSeconds={180}
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
  safe: { flex: 1, backgroundColor: "#0a0a0a" },
  container: { flex: 1, backgroundColor: "#0a0a0a" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  headerAction: { color: "#aaa", fontSize: 13, fontFamily: "Inter_400Regular", letterSpacing: 0.3 },
  headerTitle: { color: "#fff", fontSize: 14, fontFamily: "Inter_500Medium", letterSpacing: 0.5 },
  timerBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingHorizontal: 24,
    paddingVertical: 14,
    backgroundColor: "#161616",
  },
  timerLabel: {
    color: "#555",
    fontSize: 10,
    fontFamily: "Inter_400Regular",
    marginBottom: 3,
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  timerValue: { color: ACCENT, fontSize: 20, fontFamily: "Inter_400Regular", letterSpacing: 1 },
  timerValueWhite: { color: "#fff", fontSize: 20, fontFamily: "Inter_400Regular", letterSpacing: 1 },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 20 },
  exerciseCard: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginTop: 20,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: ACCENT,
    backgroundColor: "#141414",
    gap: 14,
  },
  exerciseImagePlaceholder: {
    width: 70,
    height: 70,
    borderRadius: 10,
    backgroundColor: "#1e1e1e",
    alignItems: "center",
    justifyContent: "center",
  },
  exerciseName: { flex: 1, color: "#fff", fontSize: 16, fontFamily: "Inter_500Medium", letterSpacing: 0.2 },
  setsContainer: { paddingHorizontal: 20, marginTop: 20, gap: 12 },
  doneCard: { alignItems: "center", justifyContent: "center", paddingVertical: 32, gap: 8 },
  doneText: { color: "#fff", fontSize: 16, fontFamily: "Inter_500Medium", letterSpacing: 0.3 },
  bottomArea: { paddingHorizontal: 20, paddingVertical: 14, paddingBottom: 20 },
  bottomButton: { backgroundColor: ACCENT, borderRadius: 16, paddingVertical: 18, alignItems: "center" },
  bottomButtonText: {
    color: "#0a0a0a",
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.6,
  },
});
