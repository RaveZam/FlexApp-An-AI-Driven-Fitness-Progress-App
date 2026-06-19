import Popup from "@/components/ui/Popup";
import ExercisesListSheet from "@/src/features/workouts/session/components/ExercisesListSheet";
import RestTimerModal from "@/src/features/workouts/session/components/RestTimerModal";
import SessionBottomBar from "@/src/features/workouts/session/components/SessionBottomBar";
import SessionCompleteCard from "@/src/features/workouts/session/components/SessionCompleteCard";
import SessionExerciseCard from "@/src/features/workouts/session/components/SessionExerciseCard";
import SessionHeader from "@/src/features/workouts/session/components/SessionHeader";
import SessionTimerHero from "@/src/features/workouts/session/components/SessionTimerHero";
import { LinearGradient } from "expo-linear-gradient";
import { Redirect, router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SessionStatsPanel from "../components/SessionStatsPanel";
import { cancelOngoingSession } from "../core/cancelOngoingSession";
import { useWorkoutSession } from "../hooks/useWorkoutSession";

const ACCENT = "#34d399";
const HAIRLINE = "rgba(245,243,239,0.07)";
const INK = "#060606";
const MUTED = "#6b6b6b";

export default function WorkoutSessionScreenInner() {
  const { exercises, activeSessionId, refreshActiveSession } =
    useWorkoutSession();

  const [showRestTimer, setShowRestTimer] = useState(false);
  const [showExercisesList, setShowExercisesList] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const allSetsComplete = false;
  const allExercisesComplete = false;
  const progressPct = 50;

  // Bump on every focus so the entering animations replay each time the screen
  // refocuses (entering fires only on mount, so we remount via key).
  const [focusKey, setFocusKey] = useState(0);
  useFocusEffect(
    useCallback(() => {
      setFocusKey((k) => k + 1);
    }, []),
  );

  // Re-read the active session from SQLite on every focus. The provider holds it
  // in state, so refreshing here re-renders with a fresh activeSessionId after a
  // session was finished or cancelled elsewhere.
  useFocusEffect(
    useCallback(() => {
      refreshActiveSession();
    }, [refreshActiveSession]),
  );

  // React to the fresh value: if there's no active session (e.g. a stale
  // navigation back to this route, or one that was just finished/cancelled while
  // focused), bounce to the Train page instead of showing an empty session.
  useEffect(() => {
    if (!activeSessionId) {
      router.replace("/(tabs)/Workouts");
    }
  }, [activeSessionId]);

  if (exercises.length === 0) {
    return <Redirect href="/(tabs)" />;
  }

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
          onExit={() => setShowExitConfirm(true)}
          onShowExercises={() => setShowExercisesList(true)}
        />

        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progressPct}%` }]} />
        </View>

        <SessionTimerHero />

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <SessionExerciseCard key={`exercise-${focusKey}`} />

          <SessionStatsPanel key={`stats-${focusKey}`} />

          {/* <View style={styles.setsHeader}>
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
                onEdit={() => {}}
              />
            ))}
          </View> */}

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

        <SessionBottomBar mode="log" onPress={() => setShowRestTimer(true)} />

        <RestTimerModal
          visible={showRestTimer}
          onClose={() => setShowRestTimer(false)}
        />

        <ExercisesListSheet
          visible={showExercisesList}
          onClose={() => setShowExercisesList(false)}
        />

        <Popup
          isVisible={showExitConfirm}
          onClose={() => setShowExitConfirm(false)}
          iconName="help-circle-outline"
          message="Exit this session? Your progress won't be saved."
          buttons={[
            { text: "Stay", onPress: () => setShowExitConfirm(false) },
            {
              text: "Exit",
              onPress: () => {
                cancelOngoingSession(activeSessionId);
                router.back();
              },
              style: "destructive",
            },
          ]}
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
