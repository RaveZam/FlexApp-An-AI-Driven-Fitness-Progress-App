import { FontFamilies } from "@/constants/theme";
import { usePalette, type Palette } from "@/src/theme";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { ProgressionHeader } from "../components/ProgressionHeader";
import { ProgressStatusCard } from "../components/ProgressStatusCard";
import { SessionHistoryList } from "../components/SessionHistoryList";
import { StatStrip } from "../components/StatStrip";
import { StrengthCurve } from "../components/StrengthCurve";
import { detectExerciseStatus } from "../core/detectExerciseStatus";
import { estimateOneRepMax } from "../core/estimateOneRepMax";
import { getProgressionExercise } from "../mock/progressionMock";

export default function ExerciseProgressionScreen() {
  const p = usePalette();
  const styles = useMemo(() => makeStyles(p), [p]);
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const exercise = getProgressionExercise(id ?? "");

  const status = useMemo(
    () => (exercise ? detectExerciseStatus(exercise.points) : null),
    [exercise],
  );

  const stats = useMemo(() => {
    if (!exercise) return null;
    const e1rms = exercise.points.map((p) => estimateOneRepMax(p.maxWeight, p.repsAtMax));
    const totalVolume = exercise.points.reduce(
      (sum, p) => sum + p.maxWeight * p.repsAtMax,
      0,
    );
    return {
      bestE1rm: Math.max(...e1rms, 0),
      totalVolume,
      sessions: exercise.points.length,
    };
  }, [exercise]);

  const latest = exercise?.points[exercise.points.length - 1];

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
        <ProgressionHeader
          muscleGroup={exercise?.muscleGroup ?? ""}
          onBack={() => router.back()}
        />

        {!exercise || !status || !stats ? (
          <View style={styles.notFound}>
            <View style={styles.emptyGlyph}>
              <Ionicons name="analytics-outline" size={26} color={p.muted} />
            </View>
            <Text style={styles.emptyTitle}>Exercise not found</Text>
          </View>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <Animated.View entering={FadeInDown.delay(40).duration(420)} style={styles.masthead}>
              <Text style={styles.eyebrow}>{exercise.muscleGroup}</Text>
              <Text style={styles.title} numberOfLines={2}>
                {exercise.name}
              </Text>
              {latest && (
                <View style={styles.lastRow}>
                  <Ionicons name="time-outline" size={13} color={p.muted} />
                  <Text style={styles.lastText}>
                    Last logged {latest.maxWeight} lb × {latest.repsAtMax}
                  </Text>
                </View>
              )}
            </Animated.View>

            <StrengthCurve points={exercise.points} />

            <StatStrip
              cells={[
                { label: "Best e1RM", value: `${stats.bestE1rm}` },
                { label: "Volume", value: `${Math.round(stats.totalVolume / 1000)}k` },
                { label: "Sessions", value: `${stats.sessions}` },
              ]}
            />

            <View style={styles.prCard}>
              <View style={styles.prMedallion}>
                <View style={styles.prMedallionInner}>
                  <Ionicons name="trophy" size={20} color={p.accent} />
                </View>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.prEyebrow}>Personal Record</Text>
                <Text style={styles.prDate}>
                  {new Date(exercise.best.date).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </Text>
              </View>
              <View style={styles.prValueBlock}>
                <View style={styles.prValueRow}>
                  <Text style={styles.prValue}>{exercise.best.weight}</Text>
                  <Text style={styles.prUnit}>lb</Text>
                </View>
                <Text style={styles.prSubValue}>
                  × <Text style={styles.prSubValueAccent}>{exercise.best.reps}</Text>
                </Text>
              </View>
            </View>

            <ProgressStatusCard
              isPlateaued={status.isPlateaued}
              weight={status.weight}
              reps={status.reps}
              sessionsStuck={status.sessionsStuck}
            />

            <SessionHistoryList points={exercise.points} />
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}

const makeStyles = (p: Palette) =>
  StyleSheet.create({
  safe: { flex: 1, backgroundColor: p.ink },
  container: { flex: 1, backgroundColor: "transparent" },

  scrollContent: { paddingBottom: 40 },

  masthead: { paddingHorizontal: 20, paddingTop: 6, paddingBottom: 4 },
  eyebrow: {
    color: p.accent,
    fontSize: 10,
    fontFamily: FontFamilies.medium,
    letterSpacing: 3,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  title: {
    color: p.bone,
    fontSize: 30,
    fontFamily: FontFamilies.displayLight,
    letterSpacing: -0.7,
    lineHeight: 34,
  },
  lastRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 12 },
  lastText: {
    color: p.muted,
    fontSize: 12,
    fontFamily: FontFamilies.regular,
    letterSpacing: 0.2,
  },

  prCard: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginTop: 16,
    gap: 14,
    padding: 16,
    borderRadius: 16,
    backgroundColor: p.inkRaised,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: p.hairlineStrong,
  },
  prMedallion: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: p.accentBorder,
    alignItems: "center",
    justifyContent: "center",
    padding: 4,
  },
  prMedallionInner: {
    flex: 1,
    width: "100%",
    borderRadius: 22,
    backgroundColor: p.accentSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  prEyebrow: {
    color: p.accent,
    fontSize: 9,
    fontFamily: FontFamilies.medium,
    letterSpacing: 2.2,
    textTransform: "uppercase",
    marginBottom: 3,
  },
  prDate: {
    color: p.muted,
    fontSize: 11,
    fontFamily: FontFamilies.regular,
  },
  prValueBlock: { alignItems: "flex-end" },
  prValueRow: { flexDirection: "row", alignItems: "baseline", gap: 3 },
  prValue: {
    color: p.bone,
    fontSize: 24,
    fontFamily: FontFamilies.displayLight,
    letterSpacing: -0.6,
    fontVariant: ["tabular-nums"],
  },
  prUnit: {
    color: p.muted,
    fontSize: 11,
    fontFamily: FontFamilies.displayRegular,
  },
  prSubValue: {
    color: p.muted,
    fontSize: 11,
    fontFamily: FontFamilies.regular,
    marginTop: 2,
  },
  prSubValueAccent: { color: p.accent, fontFamily: FontFamilies.medium },

  notFound: { flex: 1, alignItems: "center", justifyContent: "center" },
  emptyGlyph: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: p.hairlineStrong,
    backgroundColor: p.inkRaised,
    marginBottom: 18,
  },
  emptyTitle: {
    color: p.bone,
    fontSize: 18,
    fontFamily: FontFamilies.displayMedium,
    letterSpacing: -0.3,
  },
});
