import { FontFamilies, Palette } from "@/constants/theme";
import type { SessionExercise, SessionSet } from "@/src/features/workouts/types";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, { FadeInDown, FadeInRight } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSessionDetail } from "../hooks/useSessionDetail";

// Unilateral sets store reps per side; the analytics value is the stronger side.
function effectiveReps(set: SessionSet): number | null {
  if (set.actualRepsLeft != null || set.actualRepsRight != null) {
    return Math.max(set.actualRepsLeft ?? 0, set.actualRepsRight ?? 0);
  }
  return set.actualReps;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
}

function formatDuration(startedAt: string, completedAt: string): string {
  const ms = new Date(completedAt).getTime() - new Date(startedAt).getTime();
  const totalMin = Math.round(ms / 60000);
  if (totalMin < 60) return `${totalMin}m`;
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statTile}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function SetRow({ set, isLast }: { set: SessionSet; isLast: boolean }) {
  const dim = !set.completed;
  return (
    <View style={[styles.setRow, !isLast && styles.setRowDivider]}>
      <Text style={[styles.setNum, dim && styles.dimText]}>{set.setIndex + 1}</Text>
      <Text style={[styles.setCell, dim && styles.dimText]}>
        {set.actualRepsLeft != null || set.actualRepsRight != null
          ? `${set.actualRepsLeft ?? 0}/${set.actualRepsRight ?? 0}`
          : set.actualReps != null
          ? set.actualReps
          : set.targetReps}
      </Text>
      <Text style={[styles.setCell, dim && styles.dimText]}>
        {set.weight != null ? `${set.weight} lb` : "—"}
      </Text>
      <View style={styles.setCellCheck}>
        {set.completed ? (
          <Ionicons name="checkmark-circle" size={16} color={Palette.accent} />
        ) : (
          <Ionicons name="ellipse-outline" size={16} color={Palette.mutedSoft} />
        )}
      </View>
    </View>
  );
}

function ExerciseCard({ exercise, index }: { exercise: SessionExercise; index: number }) {
  const completedSets = exercise.sets.filter((s) => s.completed).length;
  return (
    <Animated.View entering={FadeInRight.delay(index * 80).duration(350)} style={styles.exerciseCard}>
      <View style={styles.exerciseHeader}>
        <View style={styles.exerciseBadge}>
          <Text style={styles.exerciseBadgeText}>{index + 1}</Text>
        </View>
        <Text style={styles.exerciseName} numberOfLines={1}>{exercise.name}</Text>
        <Text style={styles.exerciseMeta}>{completedSets}/{exercise.sets.length} sets</Text>
      </View>
      {exercise.sets.length > 0 && (
        <View style={styles.setTable}>
          <View style={[styles.setRow, styles.setHeaderRow]}>
            <Text style={[styles.setHeaderCell, { width: 24, flex: 0 }]}>#</Text>
            <Text style={styles.setHeaderCell}>Reps</Text>
            <Text style={styles.setHeaderCell}>Weight</Text>
            <Text style={[styles.setHeaderCell, { width: 32, flex: 0, textAlign: "right" }]}>Done</Text>
          </View>
          {exercise.sets.map((set, i) => (
            <SetRow key={set.id} set={set} isLast={i === exercise.sets.length - 1} />
          ))}
        </View>
      )}
    </Animated.View>
  );
}

export default function SessionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { session, loading } = useSessionDetail(id ?? "");

  if (loading) {
    return (
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <View style={styles.center}>
          <ActivityIndicator color={Palette.accent} />
        </View>
      </SafeAreaView>
    );
  }

  if (!session) {
    return (
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={20} color={Palette.bone} />
          <Text style={styles.backLabel}>History</Text>
        </Pressable>
        <View style={styles.center}>
          <Text style={styles.emptyTitle}>Session not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const totalSets = session.exercises.reduce((acc, ex) => acc + ex.sets.length, 0);
  const completedSets = session.exercises.reduce(
    (acc, ex) => acc + ex.sets.filter((s) => s.completed).length,
    0
  );
  const totalVolume = session.exercises.reduce((acc, ex) =>
    acc + ex.sets.reduce((a, s) => {
      const reps = effectiveReps(s);
      return a + (s.completed && s.weight != null && reps != null ? s.weight * reps : 0);
    }, 0), 0
  );
  const duration = session.completedAt
    ? formatDuration(session.startedAt, session.completedAt)
    : "—";
  const completedDate = formatDate(session.completedAt ?? session.startedAt);

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <Animated.View entering={FadeInDown.delay(0).duration(300)} style={styles.topBar}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={20} color={Palette.bone} />
          <Text style={styles.backLabel}>History</Text>
        </Pressable>
      </Animated.View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.delay(60).duration(350)} style={styles.titleBlock}>
          <Text style={styles.sessionName}>{session.name}</Text>
          <Text style={styles.sessionDate}>{completedDate}</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(120).duration(350)} style={styles.statsStrip}>
          <StatTile label="Duration" value={duration} />
          <View style={styles.statDivider} />
          <StatTile label="Sets" value={`${completedSets}/${totalSets}`} />
          <View style={styles.statDivider} />
          <StatTile
            label="Volume"
            value={totalVolume > 0 ? `${totalVolume.toLocaleString()} lb` : "—"}
          />
        </Animated.View>

        <View style={styles.sectionLabelRow}>
          <Text style={styles.sectionLabel}>Exercises</Text>
          <View style={styles.sectionRule} />
          <Text style={styles.sectionCount}>{session.exercises.length}</Text>
        </View>

        <View style={styles.exerciseList}>
          {session.exercises.map((ex, i) => (
            <ExerciseCard key={ex.id} exercise={ex} index={i} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Palette.ink,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  topBar: {
    paddingHorizontal: 12,
    paddingTop: 4,
    paddingBottom: 8,
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    alignSelf: "flex-start",
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  backLabel: {
    fontFamily: FontFamilies.medium,
    fontSize: 15,
    color: Palette.bone,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  titleBlock: {
    marginBottom: 20,
    gap: 4,
  },
  sessionName: {
    fontFamily: FontFamilies.displaySemibold,
    fontSize: 26,
    color: Palette.bone,
    letterSpacing: -0.5,
  },
  sessionDate: {
    fontFamily: FontFamilies.regular,
    fontSize: 13,
    color: Palette.muted,
  },
  statsStrip: {
    flexDirection: "row",
    backgroundColor: "#191919",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(245,243,239,0.04)",
    marginBottom: 24,
    overflow: "hidden",
  },
  statTile: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 16,
    gap: 4,
  },
  statValue: {
    fontFamily: FontFamilies.bold,
    fontSize: 18,
    color: Palette.bone,
  },
  statLabel: {
    fontFamily: FontFamilies.regular,
    fontSize: 11,
    color: Palette.muted,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  statDivider: {
    width: 1,
    backgroundColor: "rgba(245,243,239,0.07)",
    marginVertical: 12,
  },
  sectionLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
    marginLeft: 2,
  },
  sectionLabel: {
    fontFamily: FontFamilies.semibold,
    fontSize: 11,
    color: Palette.bone,
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  sectionRule: {
    flex: 1,
    height: 1,
    backgroundColor: Palette.hairline,
  },
  sectionCount: {
    fontFamily: FontFamilies.medium,
    fontSize: 11,
    color: Palette.muted,
  },
  exerciseList: {
    gap: 12,
  },
  exerciseCard: {
    backgroundColor: Palette.inkRaised,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Palette.hairline,
    overflow: "hidden",
  },
  exerciseHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 10,
  },
  exerciseBadge: {
    width: 22,
    height: 22,
    borderRadius: 6,
    backgroundColor: Palette.accentSoft,
    borderWidth: 1,
    borderColor: Palette.accentBorderSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  exerciseBadgeText: {
    fontFamily: FontFamilies.semibold,
    fontSize: 11,
    color: Palette.accent,
  },
  exerciseName: {
    fontFamily: FontFamilies.semibold,
    fontSize: 15,
    color: Palette.bone,
    flex: 1,
  },
  exerciseMeta: {
    fontFamily: FontFamilies.regular,
    fontSize: 12,
    color: Palette.accent,
  },
  setTable: {
    borderTopWidth: 1,
    borderTopColor: "rgba(245,243,239,0.07)",
  },
  setHeaderRow: {
    backgroundColor: "rgba(245,243,239,0.03)",
  },
  setRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  setRowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(245,243,239,0.05)",
  },
  setHeaderCell: {
    fontFamily: FontFamilies.medium,
    fontSize: 10,
    color: Palette.muted,
    letterSpacing: 0,
    textTransform: "uppercase",
    flex: 1,
  },
  setNum: {
    fontFamily: FontFamilies.medium,
    fontSize: 13,
    color: Palette.muted,
    width: 24,
  },
  setCell: {
    fontFamily: FontFamilies.regular,
    fontSize: 14,
    color: Palette.bone,
    flex: 1,
  },
  setCellCheck: {
    width: 32,
    alignItems: "flex-end",
  },
  dimText: {
    opacity: 0.35,
  },
  emptyTitle: {
    fontFamily: FontFamilies.medium,
    fontSize: 15,
    color: Palette.muted,
  },
});
