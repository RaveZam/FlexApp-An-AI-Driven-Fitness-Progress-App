import { FontFamilies, Palette } from "@/constants/theme";
import { getTodayLabel } from "@/src/features/home/helpers/dayLabels";
import type { Workout } from "@/src/features/workouts/types";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";

type Props = {
  workouts: Workout[];
  activePlanId: string | null;
};

export function TodaysWorkoutSection({ workouts, activePlanId }: Props) {
  if (!activePlanId) {
    return (
      <Animated.View entering={FadeInDown.delay(120).duration(400)} style={styles.todayWrap}>
        <View style={styles.emptyCard}>
          <View style={styles.emptyMedallion}>
            <Ionicons name="barbell-outline" size={16} color={Palette.muted} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.emptyTitle}>No active plan</Text>
            <TouchableOpacity onPress={() => router.push("/(tabs)/Workouts" as any)} hitSlop={8}>
              <Text style={styles.emptyAction}>Select a plan →</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    );
  }

  if (workouts.length === 0) {
    return (
      <Animated.View entering={FadeInDown.delay(120).duration(400)} style={styles.todayWrap}>
        <View style={styles.emptyCard}>
          <View style={styles.emptyMedallion}>
            <Ionicons name="bed-outline" size={16} color={Palette.muted} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.emptyTitle}>Rest day</Text>
            <Text style={styles.emptySub}>
              No workouts scheduled for {getTodayLabel()}
            </Text>
          </View>
        </View>
      </Animated.View>
    );
  }

  return (
    <Animated.View entering={FadeInDown.delay(120).duration(400)} style={[styles.todayWrap, { gap: 10 }]}>
      {workouts.map((w, i) => (
        <Animated.View
          key={w.id}
          entering={FadeIn.delay(160 + i * 60).duration(400)}
          style={styles.workoutCard}
        >
          <LinearGradient
            colors={["rgba(52,211,153,0.08)", "rgba(52,211,153,0)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFillObject}
          />
          <View style={styles.workoutRail} />
          <View style={styles.workoutBody}>
            <Text style={styles.workoutEyebrow}>Today's Lift</Text>
            <Text style={styles.workoutName}>{w.name}</Text>
            <Text style={styles.workoutMeta}>
              {w.exercises.length} exercise{w.exercises.length !== 1 ? "s" : ""}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color={Palette.muted} style={{ marginRight: 18 }} />
        </Animated.View>
      ))}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  todayWrap: { marginHorizontal: 20 },
  emptyCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: Palette.inkRaised,
    borderRadius: 16,
    padding: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Palette.hairline,
  },
  emptyMedallion: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Palette.hairlineStrong,
    backgroundColor: Palette.inkSunken,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyTitle: {
    color: Palette.bone,
    fontSize: 14,
    fontFamily: FontFamilies.displayMedium,
    letterSpacing: -0.2,
  },
  emptySub: {
    color: Palette.muted,
    fontSize: 11,
    fontFamily: FontFamilies.regular,
    marginTop: 4,
    letterSpacing: 0.3,
  },
  emptyAction: {
    color: Palette.accent,
    fontSize: 10,
    fontFamily: FontFamilies.medium,
    marginTop: 4,
    letterSpacing: 1.6,
    textTransform: "uppercase",
  },
  workoutCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Palette.inkRaised,
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Palette.hairlineStrong,
    overflow: "hidden",
  },
  workoutRail: {
    width: 2,
    alignSelf: "stretch",
    backgroundColor: Palette.accent,
    opacity: 0.7,
  },
  workoutBody: { flex: 1, paddingVertical: 16, paddingHorizontal: 18 },
  workoutEyebrow: {
    color: Palette.accent,
    fontSize: 9,
    fontFamily: FontFamilies.medium,
    letterSpacing: 2.2,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  workoutName: {
    color: Palette.bone,
    fontSize: 17,
    fontFamily: FontFamilies.displayMedium,
    letterSpacing: -0.3,
  },
  workoutMeta: {
    color: Palette.muted,
    fontSize: 11,
    fontFamily: FontFamilies.regular,
    marginTop: 3,
    letterSpacing: 0.4,
  },
});
