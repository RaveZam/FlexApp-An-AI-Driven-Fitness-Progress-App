import { FontFamilies } from "@/constants/theme";
import { getTodayLabel } from "@/src/features/home/helpers/dayLabels";
import useGetActivePlan from "@/src/features/home/hooks/useGetActivePlan";
import type { Workout } from "@/src/features/workouts";
import { usePalette, type Palette } from "@/src/theme";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useMemo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";

type Props = {
  workout: Workout | null;
  onPress?: () => void;
};

export function TodaysWorkoutSection({ workout, onPress }: Props) {
  const p = usePalette();
  const styles = useMemo(() => makeStyles(p), [p]);
  const activePlanId = useGetActivePlan();

  if (!activePlanId) {
    return (
      <Animated.View
        entering={FadeInDown.delay(120).duration(400)}
        style={styles.todayWrap}
      >
        <View style={styles.emptyCard}>
          <View style={styles.emptyMedallion}>
            <Ionicons name="barbell-outline" size={16} color={p.muted} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.emptyTitle}>No active plan</Text>
            <TouchableOpacity
              onPress={() => router.push("/(tabs)/Workouts" as any)}
              hitSlop={8}
            >
              <Text style={styles.emptyAction}>Select a plan →</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    );
  }
  //return pag rest day
  if (!workout) {
    return (
      <Animated.View
        entering={FadeInDown.delay(120).duration(400)}
        style={styles.todayWrap}
      >
        <View style={styles.emptyCard}>
          <View style={styles.emptyMedallion}>
            <Ionicons name="bed-outline" size={16} color={p.muted} />
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

  //return pag may workout
  return (
    <Animated.View
      entering={FadeInDown.delay(120).duration(400)}
      style={[styles.todayWrap, { gap: 10 }]}
    >
      <TouchableOpacity
        activeOpacity={onPress ? 0.85 : 1}
        onPress={onPress}
        disabled={!onPress}
      >
        <Animated.View
          entering={FadeIn.delay(160).duration(400)}
          style={styles.workoutCard}
        >
          <LinearGradient
            colors={[p.accentSoft, "transparent"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFillObject}
          />
          <View style={styles.workoutRail} />
          <View style={styles.workoutBody}>
            <Text style={styles.workoutEyebrow}>Today's Lift</Text>
            <Text style={styles.workoutName}>{workout.name}</Text>
            <Text style={styles.workoutMeta}>
              {workout.exercises.length} exercise
              {workout.exercises.length !== 1 ? "s" : ""}
            </Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={16}
            color={p.muted}
            style={{ marginRight: 18 }}
          />
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const makeStyles = (p: Palette) =>
  StyleSheet.create({
    todayWrap: { marginHorizontal: 20 },
    emptyCard: {
      flexDirection: "row",
      alignItems: "center",
      gap: 14,
      backgroundColor: p.inkRaised,
      borderRadius: 16,
      padding: 16,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: p.hairline,
    },
    emptyMedallion: {
      width: 38,
      height: 38,
      borderRadius: 19,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: p.hairlineStrong,
      backgroundColor: p.inkSunken,
      alignItems: "center",
      justifyContent: "center",
    },
    emptyTitle: {
      color: p.bone,
      fontSize: 14,
      fontFamily: FontFamilies.displayMedium,
      letterSpacing: -0.2,
    },
    emptySub: {
      color: p.muted,
      fontSize: 11,
      fontFamily: FontFamilies.regular,
      marginTop: 4,
      letterSpacing: 0.3,
    },
    emptyAction: {
      color: p.accent,
      fontSize: 10,
      fontFamily: FontFamilies.medium,
      marginTop: 4,
      letterSpacing: 1.6,
      textTransform: "uppercase",
    },
    workoutCard: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: p.inkRaised,
      borderRadius: 18,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: p.hairlineStrong,
      overflow: "hidden",
    },
    workoutRail: {
      width: 2,
      alignSelf: "stretch",
      backgroundColor: p.accent,
      opacity: 0.7,
    },
    workoutBody: { flex: 1, paddingVertical: 16, paddingHorizontal: 18 },
    workoutEyebrow: {
      color: p.accent,
      fontSize: 9,
      fontFamily: FontFamilies.medium,
      letterSpacing: 2.2,
      textTransform: "uppercase",
      marginBottom: 4,
    },
    workoutName: {
      color: p.bone,
      fontSize: 17,
      fontFamily: FontFamilies.displayMedium,
      letterSpacing: -0.3,
    },
    workoutMeta: {
      color: p.muted,
      fontSize: 11,
      fontFamily: FontFamilies.regular,
      marginTop: 3,
      letterSpacing: 0.4,
    },
  });
