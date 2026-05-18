import ExercisesListSheet from "@/src/features/workouts/components/session/ExercisesListSheet";
import RestTimerModal from "@/src/features/workouts/components/session/RestTimerModal";
import SetRow from "@/src/features/workouts/components/session/SetRow";
import WorkoutLogModal from "@/src/features/workouts/components/session/WorkoutLogModal";
import { useExerciseHistory } from "@/src/features/workouts/hooks/useExerciseHistory";
import { useWorkoutSession } from "@/src/features/workouts/hooks/useWorkoutSession";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const ACCENT = "#34d399";
const ACCENT_DEEP = "#059669";
const BONE = "#f5f3ef";
const INK = "#060606";
const HAIRLINE = "rgba(245,243,239,0.07)";
const HAIRLINE_STRONG = "rgba(245,243,239,0.14)";
const MUTED = "#6b6b6b";
const MUTED_SOFT = "#3a3a3a";

function formatTime(totalSec: number): string {
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export default function WorkoutSessionScreen() {
  const { id: sessionId } = useLocalSearchParams<{ id?: string }>();
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
    goToNextExercise,
    finish,
  } = useWorkoutSession(sessionId);

  const [showLogModal, setShowLogModal] = useState(false);
  const [showRestTimer, setShowRestTimer] = useState(false);
  const [showExercisesList, setShowExercisesList] = useState(false);

  const completedSetCount = exercises.reduce(
    (acc, ex) => acc + ex.sets.filter((s) => s.completed).length,
    0
  );
  const { best, recentSessions } = useExerciseHistory(active?.name, completedSetCount);
  const maxChartWeight = recentSessions.reduce((m, p) => Math.max(m, p.maxWeight), 0);
  const [selectedBarIndex, setSelectedBarIndex] = useState<number | null>(null);
  const selectedSession =
    selectedBarIndex !== null ? recentSessions[selectedBarIndex] ?? null : null;

  useEffect(() => {
    setSelectedBarIndex(null);
  }, [active?.id]);

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

  const restMin = Math.floor(active.restSeconds / 60);
  const restSec = (active.restSeconds % 60).toString().padStart(2, "0");
  const progressPct = exercises.length
    ? ((activeIndex + (allSetsComplete ? 1 : 0)) / exercises.length) * 100
    : 0;

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      {/* Ambient atmospheric gradient */}
      <LinearGradient
        colors={["rgba(52,211,153,0.08)", "transparent"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 0.4 }}
        style={StyleSheet.absoluteFillObject}
        pointerEvents="none"
      />

      <View style={styles.container}>
        {/* Header */}
        <Animated.View entering={FadeIn.duration(400)} style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.6} hitSlop={10}>
            <Text style={styles.headerAction}>Exit</Text>
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerEyebrow}>In Session</Text>
            <Text style={styles.headerTitle}>
              {(activeIndex + 1).toString().padStart(2, "0")}{" "}
              <Text style={styles.headerTitleDim}>/ {exercises.length.toString().padStart(2, "0")}</Text>
            </Text>
          </View>
          <TouchableOpacity onPress={() => setShowExercisesList(true)} activeOpacity={0.6} hitSlop={10}>
            <Text style={styles.headerAction}>Exercises</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Progress hairline */}
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progressPct}%` }]} />
        </View>

        {/* Hero timer */}
        <Animated.View entering={FadeInDown.delay(60).duration(400)} style={styles.timerHero}>
          <View style={styles.timerBlock}>
            <Text style={styles.timerLabel}>Elapsed</Text>
            <Text style={styles.timerValue}>{formatTime(elapsedSeconds)}</Text>
          </View>
          <View style={styles.timerDivider} />
          <View style={[styles.timerBlock, { alignItems: "flex-end" }]}>
            <Text style={styles.timerLabel}>Rest Interval</Text>
            <Text style={styles.timerValueAlt}>
              {restMin}:{restSec}
            </Text>
          </View>
        </Animated.View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Exercise hero card */}
          <Animated.View entering={FadeInDown.delay(120).duration(500)} style={styles.exerciseCard}>
            <LinearGradient
              colors={["rgba(52,211,153,0.10)", "rgba(52,211,153,0)"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFillObject}
            />
            <View style={styles.exerciseCardInner}>
              <View style={styles.exerciseMedallion}>
                <View style={styles.medallionInner}>
                  <Ionicons name="barbell" size={26} color={ACCENT} />
                </View>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.exerciseEyebrow}>Current Lift</Text>
                <Text style={styles.exerciseName}>{active.name}</Text>
                <Text style={styles.exerciseMeta}>
                  {active.sets.length} sets · target {active.sets[0]?.targetReps ?? "—"} reps
                </Text>
              </View>
            </View>
          </Animated.View>

          {/* PR + History */}
          <Animated.View entering={FadeInDown.delay(180).duration(500)} style={styles.statsPanel}>
            <View style={styles.prSection}>
              <Text style={styles.sectionLabel}>Personal Record</Text>
              {best ? (
                <>
                  <View style={styles.prValueRow}>
                    <Text style={styles.prValue}>{best.weight}</Text>
                    <Text style={styles.prValueUnit}>lb</Text>
                  </View>
                  <Text style={styles.prSubvalue}>
                    × <Text style={styles.prSubvalueAccent}>{best.reps}</Text> reps
                  </Text>
                  <View style={styles.prRule} />
                  <Text style={styles.prDate}>
                    {new Date(best.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "2-digit",
                      year: "numeric",
                    })}
                  </Text>
                </>
              ) : (
                <>
                  <Text style={styles.prValuePlaceholder}>—</Text>
                  <Text style={styles.prDate}>No record yet</Text>
                </>
              )}
            </View>

            <View style={styles.statsDivider} />

            <View style={styles.historySection}>
              <View style={styles.historyHeader}>
                <Text style={styles.sectionLabel}>Last 7 Sessions</Text>
                {selectedSession ? (
                  <Text style={styles.chartTooltip}>
                    <Text style={styles.chartTooltipValue}>{selectedSession.maxWeight}lb</Text>
                    {selectedSession.repsAtMax > 0 ? ` × ${selectedSession.repsAtMax}` : ""}
                    <Text style={styles.chartTooltipDate}>
                      {"  "}·{"  "}
                      {new Date(selectedSession.startedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "2-digit",
                      })}
                    </Text>
                  </Text>
                ) : (
                  <Text style={styles.chartTooltipHint}>
                    {recentSessions.length > 0 ? "Tap a bar" : ""}
                  </Text>
                )}
              </View>

              <View style={styles.chartWrap}>
                <View style={styles.chartBaseline} />
                <View style={styles.historyChart}>
                  {recentSessions.length === 0 ? (
                    <Text style={styles.emptyChart}>No sessions yet</Text>
                  ) : (
                    recentSessions.map((p, i) => {
                      const heightPx =
                        maxChartWeight > 0 ? Math.max(4, (p.maxWeight / maxChartWeight) * 56) : 4;
                      const isSelected = selectedBarIndex === i;
                      const isPR = best ? p.maxWeight >= best.weight : false;
                      return (
                        <Pressable
                          key={p.sessionId}
                          hitSlop={8}
                          onPress={() => setSelectedBarIndex(isSelected ? null : i)}
                          style={styles.barTouch}
                        >
                          <View style={styles.barColumn}>
                            <View
                              style={{
                                width: 10,
                                height: heightPx,
                                borderRadius: 2,
                                overflow: "hidden",
                                opacity: isSelected ? 1 : 0.55 + (i / Math.max(1, recentSessions.length - 1)) * 0.4,
                              }}
                            >
                              <LinearGradient
                                colors={isPR ? [ACCENT, ACCENT_DEEP] : [ACCENT, "rgba(52,211,153,0.35)"]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 0, y: 1 }}
                                style={{ flex: 1 }}
                              />
                            </View>
                            {isSelected && <View style={styles.barIndicator} />}
                          </View>
                        </Pressable>
                      );
                    })
                  )}
                </View>
              </View>
            </View>
          </Animated.View>

          {/* Sets */}
          <View style={styles.setsHeader}>
            <Text style={styles.sectionLabel}>Sets</Text>
            <Text style={styles.setsCounter}>
              {active.sets.filter((s) => s.completed).length} / {active.sets.length}
            </Text>
          </View>
          <View style={styles.setsContainer}>
            {active.sets.map((set, index) => (
              <SetRow key={set.id} set={set} isCurrent={index === currentSetIndex} index={index} />
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

        {/* Bottom action */}
        <Animated.View entering={FadeInDown.delay(280).duration(400)} style={styles.bottomArea}>
          <TouchableOpacity activeOpacity={0.85} onPress={bottomAction} style={styles.bottomButton}>
            <Text style={styles.bottomButtonText}>{bottomText}</Text>
            <View style={styles.bottomButtonGlyph}>
              <Ionicons
                name={allExercisesComplete ? "checkmark" : allSetsComplete ? "arrow-forward" : "add"}
                size={14}
                color={ACCENT}
              />
            </View>
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
  safe: { flex: 1, backgroundColor: INK },
  container: { flex: 1, backgroundColor: "transparent" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 14,
  },
  headerCenter: { alignItems: "center" },
  headerEyebrow: {
    color: ACCENT,
    fontSize: 9,
    fontFamily: "Inter_500Medium",
    letterSpacing: 2.4,
    textTransform: "uppercase",
    marginBottom: 3,
  },
  headerAction: {
    color: BONE,
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    letterSpacing: 1.4,
    textTransform: "uppercase",
    opacity: 0.75,
  },
  headerTitle: {
    color: BONE,
    fontSize: 15,
    fontFamily: "Outfit_500Medium",
    letterSpacing: 1,
    fontVariant: ["tabular-nums"],
  },
  headerTitleDim: { color: MUTED_SOFT, fontFamily: "Outfit_300Light" },

  progressTrack: {
    height: 1,
    marginHorizontal: 24,
    backgroundColor: HAIRLINE,
    overflow: "hidden",
  },
  progressFill: { height: "100%", backgroundColor: ACCENT },

  timerHero: {
    flexDirection: "row",
    alignItems: "stretch",
    paddingHorizontal: 24,
    paddingVertical: 22,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: HAIRLINE,
  },
  timerBlock: { flex: 1, justifyContent: "center" },
  timerDivider: { width: StyleSheet.hairlineWidth, backgroundColor: HAIRLINE_STRONG, marginHorizontal: 18 },
  timerLabel: {
    color: MUTED,
    fontSize: 9,
    fontFamily: "Inter_500Medium",
    marginBottom: 6,
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  timerValue: {
    color: BONE,
    fontSize: 38,
    fontFamily: "Outfit_300Light",
    letterSpacing: -0.5,
    fontVariant: ["tabular-nums"],
    lineHeight: 42,
  },
  timerValueAlt: {
    color: ACCENT,
    fontSize: 38,
    fontFamily: "Outfit_300Light",
    letterSpacing: -0.5,
    fontVariant: ["tabular-nums"],
    lineHeight: 42,
  },

  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 32 },

  exerciseCard: {
    marginHorizontal: 20,
    marginTop: 22,
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: HAIRLINE_STRONG,
    backgroundColor: "#0c0c0c",
    overflow: "hidden",
  },
  exerciseCardInner: {
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
    gap: 16,
  },
  exerciseMedallion: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(52,211,153,0.45)",
    alignItems: "center",
    justifyContent: "center",
    padding: 6,
  },
  medallionInner: {
    flex: 1,
    width: "100%",
    borderRadius: 30,
    backgroundColor: "rgba(52,211,153,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  exerciseEyebrow: {
    color: ACCENT,
    fontSize: 9,
    fontFamily: "Inter_500Medium",
    letterSpacing: 2.2,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  exerciseName: {
    color: BONE,
    fontSize: 22,
    fontFamily: "Outfit_500Medium",
    letterSpacing: -0.4,
    marginBottom: 4,
  },
  exerciseMeta: {
    color: MUTED,
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    letterSpacing: 0.2,
  },

  statsPanel: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginTop: 16,
    paddingVertical: 20,
    paddingHorizontal: 18,
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: HAIRLINE,
    backgroundColor: "#0a0a0a",
  },
  statsDivider: { width: StyleSheet.hairlineWidth, backgroundColor: HAIRLINE_STRONG, marginHorizontal: 16 },
  sectionLabel: {
    color: MUTED,
    fontSize: 9,
    fontFamily: "Inter_500Medium",
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 12,
  },

  prSection: { flex: 1 },
  prValueRow: { flexDirection: "row", alignItems: "baseline", gap: 4 },
  prValue: {
    color: BONE,
    fontSize: 36,
    fontFamily: "Outfit_300Light",
    letterSpacing: -1,
    fontVariant: ["tabular-nums"],
    lineHeight: 40,
  },
  prValueUnit: {
    color: MUTED,
    fontSize: 13,
    fontFamily: "Outfit_400Regular",
    letterSpacing: 0.5,
  },
  prValuePlaceholder: {
    color: MUTED_SOFT,
    fontSize: 36,
    fontFamily: "Outfit_200ExtraLight",
    lineHeight: 40,
  },
  prSubvalue: {
    color: MUTED,
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    marginTop: 2,
    letterSpacing: 0.3,
  },
  prSubvalueAccent: { color: ACCENT, fontFamily: "Inter_500Medium" },
  prRule: { height: StyleSheet.hairlineWidth, backgroundColor: HAIRLINE_STRONG, marginTop: 12, width: 24 },
  prDate: {
    color: MUTED_SOFT,
    fontSize: 10,
    fontFamily: "Inter_400Regular",
    marginTop: 8,
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },

  historySection: { flex: 1.1 },
  historyHeader: { marginBottom: 12 },
  chartTooltip: {
    color: BONE,
    fontSize: 11,
    fontFamily: "Outfit_400Regular",
    letterSpacing: 0.2,
    marginTop: -6,
  },
  chartTooltipValue: {
    color: ACCENT,
    fontFamily: "Outfit_500Medium",
    fontVariant: ["tabular-nums"],
  },
  chartTooltipDate: {
    color: MUTED,
    fontFamily: "Inter_400Regular",
    fontSize: 10,
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  chartTooltipHint: {
    color: MUTED_SOFT,
    fontSize: 10,
    fontFamily: "Inter_400Regular",
    letterSpacing: 1.4,
    textTransform: "uppercase",
    marginTop: -6,
    height: 14,
  },
  chartWrap: { position: "relative" },
  chartBaseline: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 8,
    height: StyleSheet.hairlineWidth,
    backgroundColor: HAIRLINE,
  },
  historyChart: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: 64,
    paddingBottom: 8,
  },
  barTouch: { paddingHorizontal: 2, justifyContent: "flex-end", alignItems: "center" },
  barColumn: { alignItems: "center" },
  barIndicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: ACCENT,
    marginTop: 4,
  },
  emptyChart: {
    color: MUTED_SOFT,
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    letterSpacing: 0.5,
    alignSelf: "center",
    marginTop: 24,
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

  bottomArea: { paddingHorizontal: 20, paddingTop: 14, paddingBottom: 22 },
  bottomButton: {
    height: 58,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
    backgroundColor: "#0c0c0c",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(52,211,153,0.45)",
  },
  bottomButtonText: {
    color: BONE,
    fontSize: 13,
    fontFamily: "Outfit_500Medium",
    letterSpacing: 2.4,
    textTransform: "uppercase",
  },
  bottomButtonGlyph: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(52,211,153,0.45)",
    alignItems: "center",
    justifyContent: "center",
  },
});
