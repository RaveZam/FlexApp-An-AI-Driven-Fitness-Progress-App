import RestTimerModal from "@/src/features/workouts/components/session/RestTimerModal";
import SetRow from "@/src/features/workouts/components/session/SetRow";
import WorkoutLogModal from "@/src/features/workouts/components/session/WorkoutLogModal";
import {
  Exercise,
  MOCK_WORKOUT_SESSION,
} from "@/src/features/workouts/data/mockWorkoutSession";
import { completeSession, getSessionById, updateSet } from "@/src/features/workouts/services/sessionLocalService";
import type { WorkoutSession as RealWorkoutSession } from "@/src/features/workouts/types";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeOut,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const ACCENT = "#10b981";

type AlternateWorkout = {
  id: string;
  name: string;
  exerciseCount: number;
  accent: string;
  exercises: Exercise[];
};

// Placeholder alternate workouts — swap these out with real data when wired to Supabase
const ALTERNATE_WORKOUTS: AlternateWorkout[] = [
  {
    id: "alt-1",
    name: "Wednesday Legs",
    exerciseCount: 5,
    accent: "#3b82f6",
    exercises: JSON.parse(JSON.stringify(MOCK_WORKOUT_SESSION.exercises)),
  },
  {
    id: "alt-2",
    name: "Friday Pull Day",
    exerciseCount: 7,
    accent: "#f59e0b",
    exercises: JSON.parse(JSON.stringify(MOCK_WORKOUT_SESSION.exercises)),
  },
];

function SwapWorkoutSheet({
  visible,
  currentName,
  onSelect,
  onClose,
}: {
  visible: boolean;
  currentName: string;
  onSelect: (workout: AlternateWorkout) => void;
  onClose: () => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <Animated.View
        entering={FadeIn.duration(200)}
        exiting={FadeOut.duration(150)}
        style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.65)", justifyContent: "flex-end" }}
      >
        <Pressable style={{ flex: 1 }} onPress={onClose} />
        <Animated.View
          entering={FadeInDown.duration(280).duration(400)}
          style={{
            backgroundColor: "#141414",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            borderTopWidth: 1,
            borderColor: "rgba(255,255,255,0.06)",
            paddingBottom: 40,
          }}
        >
          {/* Handle */}
          <View style={{ alignItems: "center", paddingTop: 12, paddingBottom: 4 }}>
            <View style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: "#333" }} />
          </View>

          {/* Header */}
          <View style={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 20 }}>
            <Text style={{ color: "#fff", fontSize: 16, fontFamily: "Inter_600SemiBold", letterSpacing: -0.2 }}>
              Swap Workout
            </Text>
            <Text style={{ color: "#555", fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 4, letterSpacing: 0.1 }}>
              Currently:{" "}
              <Text style={{ color: "#888" }}>{currentName}</Text>
            </Text>
          </View>

          {/* Options */}
          <View style={{ paddingHorizontal: 20, gap: 10 }}>
            {ALTERNATE_WORKOUTS.map((workout) => (
              <TouchableOpacity
                key={workout.id}
                activeOpacity={0.7}
                onPress={() => onSelect(workout)}
              >
                <View
                  style={{
                    backgroundColor: "#1a1a1a",
                    borderRadius: 14,
                    overflow: "hidden",
                    borderWidth: 1,
                    borderColor: "rgba(255,255,255,0.05)",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <View style={{ width: 3, alignSelf: "stretch", backgroundColor: workout.accent, opacity: 0.7 }} />
                  <View
                    style={{
                      flex: 1,
                      padding: 14,
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <View>
                      <Text style={{ color: "#fff", fontSize: 14, fontFamily: "Inter_500Medium", marginBottom: 4, letterSpacing: 0.1 }}>
                        {workout.name}
                      </Text>
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                        <Ionicons name="barbell-outline" size={11} color="#444" />
                        <Text style={{ color: "#444", fontSize: 11, fontFamily: "Inter_400Regular" }}>
                          {workout.exerciseCount} exercises
                        </Text>
                      </View>
                    </View>
                    <Ionicons name="arrow-forward-circle-outline" size={20} color={workout.accent} style={{ opacity: 0.8 }} />
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

function sessionToExercises(session: RealWorkoutSession): Exercise[] {
  return session.exercises.map((ex) => ({
    id: ex.id,
    name: ex.name,
    restSeconds: 90,
    sets: ex.sets.map((s, i) => ({
      id: s.id,
      setNumber: s.setIndex + 1,
      targetReps: s.targetReps,
      weight: s.weight,
      actualReps: s.actualReps,
      completed: s.completed,
    })),
  }));
}

export default function WorkoutSessionScreen() {
  const { id: sessionId } = useLocalSearchParams<{ id?: string }>();

  const realSession = sessionId ? getSessionById(sessionId) : null;

  const [workoutName, setWorkoutName] = useState(
    realSession?.name ?? MOCK_WORKOUT_SESSION.name ?? "Today's Workout"
  );
  const [exercises, setExercises] = useState<Exercise[]>(
    realSession
      ? sessionToExercises(realSession)
      : JSON.parse(JSON.stringify(MOCK_WORKOUT_SESSION.exercises))
  );
  const [activeExerciseIndex, setActiveExerciseIndex] = useState(0);
  const [showLogModal, setShowLogModal] = useState(false);
  const [showRestTimer, setShowRestTimer] = useState(false);
  const [showExercisesList, setShowExercisesList] = useState(false);
  const [showSwapSheet, setShowSwapSheet] = useState(false);

  // Timer
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setElapsedSeconds((s) => s + 1);
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const formatTime = (totalSec: number) => {
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const activeExercise = exercises[activeExerciseIndex];
  const completedSets = activeExercise.sets.filter((s) => s.completed);
  const currentSetIndex = activeExercise.sets.findIndex((s) => !s.completed);
  const allSetsComplete = currentSetIndex === -1;
  const totalExercises = exercises.length;

  const allExercisesComplete = exercises.every((ex) =>
    ex.sets.every((s) => s.completed)
  );

  const handleSwapWorkout = useCallback((workout: AlternateWorkout) => {
    setWorkoutName(workout.name);
    setExercises(JSON.parse(JSON.stringify(workout.exercises)));
    setActiveExerciseIndex(0);
    setShowSwapSheet(false);
  }, []);

  const handleLogSet = useCallback(
    (weight: number, reps: number) => {
      if (currentSetIndex === -1) return;

      const totalIncomplete = exercises.reduce(
        (acc, ex) => acc + ex.sets.filter((s) => !s.completed).length,
        0
      );
      const isLastSet = totalIncomplete === 1;

      const setId = exercises[activeExerciseIndex].sets[currentSetIndex].id;
      setExercises((prev) => {
        const updated = [...prev];
        const exercise = { ...updated[activeExerciseIndex] };
        const sets = [...exercise.sets];
        sets[currentSetIndex] = {
          ...sets[currentSetIndex],
          weight,
          actualReps: reps,
          completed: true,
        };
        exercise.sets = sets;
        updated[activeExerciseIndex] = exercise;
        return updated;
      });
      if (sessionId) {
        updateSet(setId, { actualReps: reps, weight, completed: true });
      }
      setShowLogModal(false);
      if (!isLastSet) setShowRestTimer(true);
    },
    [activeExerciseIndex, currentSetIndex, exercises]
  );

  const handleNextExercise = useCallback(() => {
    const nextIncomplete = exercises.findIndex(
      (ex, i) => i > activeExerciseIndex && !ex.sets.every((s) => s.completed)
    );
    if (nextIncomplete !== -1) {
      setActiveExerciseIndex(nextIncomplete);
    } else {
      const first = exercises.findIndex(
        (ex) => !ex.sets.every((s) => s.completed)
      );
      if (first !== -1) setActiveExerciseIndex(first);
    }
  }, [exercises, activeExerciseIndex]);

  const handleFinish = useCallback(() => {
    if (sessionId) completeSession(sessionId);
    router.back();
  }, [sessionId]);

  let bottomButtonText = "Log Set";
  let bottomButtonAction = () => setShowLogModal(true);
  if (allExercisesComplete) {
    bottomButtonText = "Finish Workout";
    bottomButtonAction = handleFinish;
  } else if (allSetsComplete) {
    bottomButtonText = "Next Exercise";
    bottomButtonAction = handleNextExercise;
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.container}>
        {/* Header */}
        <Animated.View entering={FadeIn.duration(300)} style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
            <Text style={styles.headerAction}>Exit</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            Workout {activeExerciseIndex + 1}/{totalExercises}
          </Text>
          <View style={styles.headerRight}>
            <TouchableOpacity
              onPress={() => setShowSwapSheet(true)}
              activeOpacity={0.7}
              style={styles.headerIconBtn}
            >
              <Ionicons name="swap-horizontal-outline" size={18} color="#aaa" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setShowExercisesList(true)}
              activeOpacity={0.7}
            >
              <Text style={styles.headerAction}>Exercises</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Timer Bar */}
        <Animated.View
          entering={FadeInDown.delay(60).duration(300)}
          style={styles.timerBar}
        >
          <View>
            <Text style={styles.timerLabel}>Time:</Text>
            <Text style={styles.timerValue}>{formatTime(elapsedSeconds)}</Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={styles.timerLabel}>Rest Time:</Text>
            <Text style={styles.timerValueWhite}>
              {Math.floor(activeExercise.restSeconds / 60)}:
              {(activeExercise.restSeconds % 60).toString().padStart(2, "0")}
            </Text>
          </View>
        </Animated.View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Exercise Card */}
          <Animated.View
            entering={FadeInDown.delay(120).duration(400)}
            style={styles.exerciseCard}
          >
            <View style={styles.exerciseImagePlaceholder}>
              <Ionicons name="barbell" size={32} color={ACCENT} />
            </View>
            <Text style={styles.exerciseName}>{activeExercise.name}</Text>
          </Animated.View>

          {/* Personal Record + History */}
          <Animated.View
            entering={FadeInDown.delay(180).duration(400)}
            style={styles.prHistoryRow}
          >
            <View style={styles.prSection}>
              <Text style={styles.prTitle}>Personal Record:</Text>
              <Text style={styles.prStat}>
                Weight: <Text style={styles.prHighlight}>50lb</Text>
              </Text>
              <Text style={styles.prStat}>
                Reps: <Text style={styles.prHighlight}>9</Text>
              </Text>
              <Text style={styles.prDate}>03/21/2025</Text>
            </View>
            <View style={styles.historySection}>
              <Text style={styles.historyTitle}>History</Text>
              <View style={styles.historyChart}>
                <View style={styles.chartBar1} />
                <View style={styles.chartBar2} />
                <View style={styles.chartBar3} />
                <View style={styles.chartBar4} />
                <View style={styles.chartBar5} />
              </View>
            </View>
          </Animated.View>

          {/* Set Rows */}
          <View style={styles.setsContainer}>
            {activeExercise.sets.map((set, index) => (
              <SetRow
                key={set.id}
                set={set}
                isCurrent={index === currentSetIndex}
                index={index}
              />
            ))}
          </View>

          {allSetsComplete && !allExercisesComplete && (
            <Animated.View
              entering={FadeInDown.delay(100).duration(400)}
              style={styles.doneCard}
            >
              <Ionicons name="checkmark-circle" size={32} color={ACCENT} />
              <Text style={styles.doneText}>All sets complete!</Text>
            </Animated.View>
          )}

          {allExercisesComplete && (
            <Animated.View
              entering={FadeInDown.delay(100).duration(400)}
              style={styles.doneCard}
            >
              <Ionicons name="trophy" size={36} color={ACCENT} />
              <Text style={styles.doneText}>Workout Complete!</Text>
            </Animated.View>
          )}
        </ScrollView>

        {/* Bottom Button */}
        <Animated.View
          entering={FadeInDown.delay(300).duration(400)}
          style={styles.bottomArea}
        >
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={bottomButtonAction}
            style={styles.bottomButton}
          >
            <Text style={styles.bottomButtonText}>{bottomButtonText}</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Rest Timer */}
        <RestTimerModal
          visible={showRestTimer}
          onClose={() => setShowRestTimer(false)}
          durationSeconds={180}
        />

        {/* Log Modal */}
        <WorkoutLogModal
          visible={showLogModal}
          exerciseName={activeExercise.name}
          setNumber={allSetsComplete ? activeExercise.sets.length : currentSetIndex + 1}
          totalSets={activeExercise.sets.length}
          targetReps={
            allSetsComplete
              ? 0
              : activeExercise.sets[currentSetIndex]?.targetReps ?? 0
          }
          onLog={handleLogSet}
          onClose={() => setShowLogModal(false)}
        />

        {/* Exercises List Modal */}
        <Modal
          visible={showExercisesList}
          transparent
          animationType="slide"
          onRequestClose={() => setShowExercisesList(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.exercisesListModal}>
              <View style={styles.exercisesListHeader}>
                <Text style={styles.exercisesListTitle}>Exercises</Text>
                <TouchableOpacity onPress={() => setShowExercisesList(false)}>
                  <Ionicons name="close" size={24} color="#fff" />
                </TouchableOpacity>
              </View>
              {exercises.map((ex, i) => {
                const completedCount = ex.sets.filter((s) => s.completed).length;
                const totalCount = ex.sets.length;
                const done = completedCount === totalCount;
                const isActive = i === activeExerciseIndex;
                return (
                  <TouchableOpacity
                    key={ex.id}
                    activeOpacity={0.7}
                    onPress={() => {
                      setActiveExerciseIndex(i);
                      setShowExercisesList(false);
                    }}
                    style={[
                      styles.exerciseListItem,
                      isActive && styles.exerciseListItemActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.exerciseListText,
                        isActive && styles.exerciseListTextActive,
                      ]}
                    >
                      {ex.name}
                    </Text>
                    <View style={styles.exerciseListRight}>
                      <Text style={[styles.exerciseSetCount, done && styles.exerciseSetCountDone]}>
                        {completedCount}/{totalCount}
                      </Text>
                      {done && (
                        <Ionicons name="checkmark-circle" size={20} color={ACCENT} />
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </Modal>

        {/* Swap Workout Sheet */}
        <SwapWorkoutSheet
          visible={showSwapSheet}
          currentName={workoutName}
          onSelect={handleSwapWorkout}
          onClose={() => setShowSwapSheet(false)}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#0a0a0a",
  },
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  headerAction: {
    color: "#aaa",
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    letterSpacing: 0.3,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Inter_500Medium",
    letterSpacing: 0.5,
    paddingLeft: 32,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  headerIconBtn: {
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },

  // Timer
  timerBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingHorizontal: 24,
    paddingVertical: 14,
    backgroundColor: "#161616",
    marginHorizontal: 0,
  },
  timerLabel: {
    color: "#555",
    fontSize: 10,
    fontFamily: "Inter_400Regular",
    marginBottom: 3,
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  timerValue: {
    color: ACCENT,
    fontSize: 20,
    fontFamily: "Inter_400Regular",
    letterSpacing: 1,
  },
  timerValueWhite: {
    color: "#fff",
    fontSize: 20,
    fontFamily: "Inter_400Regular",
    letterSpacing: 1,
  },

  // Scroll
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },

  // Exercise Card
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
  exerciseName: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
    fontFamily: "Inter_500Medium",
    letterSpacing: 0.2,
  },

  // PR + History
  prHistoryRow: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginTop: 18,
    gap: 16,
  },
  prSection: {
    flex: 1,
  },
  prTitle: {
    color: "#888",
    fontSize: 9,
    fontFamily: "Inter_500Medium",
    marginBottom: 8,
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  prStat: {
    color: "#777",
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    lineHeight: 19,
    letterSpacing: 0.2,
  },
  prHighlight: {
    color: ACCENT,
    fontFamily: "Inter_500Medium",
  },
  prDate: {
    color: "#444",
    fontSize: 10,
    fontFamily: "Inter_400Regular",
    marginTop: 4,
    letterSpacing: 0.3,
  },
  historySection: {
    flex: 1,
    alignItems: "center",
  },
  historyTitle: {
    color: "#888",
    fontSize: 9,
    fontFamily: "Inter_500Medium",
    marginBottom: 10,
    alignSelf: "center",
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  historyChart: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 4,
    height: 45,
  },
  chartBar1: {
    width: 18,
    height: 30,
    borderRadius: 3,
    backgroundColor: ACCENT,
    opacity: 0.5,
  },
  chartBar2: {
    width: 18,
    height: 40,
    borderRadius: 3,
    backgroundColor: ACCENT,
    opacity: 0.6,
  },
  chartBar3: {
    width: 18,
    height: 25,
    borderRadius: 3,
    backgroundColor: ACCENT,
    opacity: 0.7,
  },
  chartBar4: {
    width: 18,
    height: 45,
    borderRadius: 3,
    backgroundColor: ACCENT,
    opacity: 0.85,
  },
  chartBar5: {
    width: 18,
    height: 35,
    borderRadius: 3,
    backgroundColor: ACCENT,
  },

  // Sets
  setsContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
    gap: 12,
  },

  // Done state
  doneCard: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 32,
    gap: 8,
  },
  doneText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Inter_500Medium",
    letterSpacing: 0.3,
  },

  // Bottom
  bottomArea: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    paddingBottom: 20,
  },
  bottomButton: {
    backgroundColor: ACCENT,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: "center",
  },
  bottomButtonText: {
    color: "#0a0a0a",
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.6,
  },

  // Exercises List Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "flex-end",
  },
  exercisesListModal: {
    backgroundColor: "#1a1a1a",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  exercisesListHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  exercisesListTitle: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Inter_500Medium",
    letterSpacing: 0.3,
  },
  exerciseListItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 4,
  },
  exerciseListItemActive: {
    backgroundColor: "rgba(16,185,129,0.1)",
  },
  exerciseListText: {
    color: "#666",
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    letterSpacing: 0.2,
  },
  exerciseListTextActive: {
    color: "#fff",
    fontFamily: "Inter_500Medium",
  },
  exerciseListRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  exerciseSetCount: {
    color: "#555",
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    letterSpacing: 0.2,
  },
  exerciseSetCountDone: {
    color: ACCENT,
    fontFamily: "Inter_500Medium",
  },
});
