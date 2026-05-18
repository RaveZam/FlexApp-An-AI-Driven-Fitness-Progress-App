import "react-native-reanimated";

import { FontFamilies, Palette } from "@/constants/theme";
import BlurOverlay from "@/components/ui/BlurOverlay";
import LoadingOverlay from "@/components/ui/LoadingOverlay";
import Popup from "@/components/ui/Popup";
import ScheduleBar from "@/components/ui/ScheduleBar";
import UserInfoCard from "@/components/UserInfoCard";
import { useAuth } from "@/src/features/auth/hooks/useAuth";
import {
  HomePageChartGraph,
  Insights,
  PersonalRecord,
  ProgressiveOverload,
  WeeklyVolume,
} from "@/src/features/home/components";
import { useActivePlan } from "@/src/features/workouts/hooks/useActivePlan";
import { useActiveSession } from "@/src/features/workouts/hooks/useActiveSession";
import { useStartSession } from "@/src/features/workouts/hooks/useStartSession";
import { useTodaysWorkouts } from "@/src/features/workouts/hooks/useTodaysWorkouts";
import type { Workout } from "@/src/features/workouts/types";

import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as NavigationBar from "expo-navigation-bar";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  configureReanimatedLogger,
  FadeIn,
  FadeInDown,
  ReanimatedLogLevel,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import "@/global.css";

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function SectionLabel({ eyebrow, title, delay = 0 }: { eyebrow: string; title: string; delay?: number }) {
  return (
    <Animated.View entering={FadeInDown.delay(delay).duration(400)} style={styles.sectionHead}>
      <Text style={styles.eyebrow}>{eyebrow}</Text>
      <Text style={styles.sectionTitle}>{title}</Text>
    </Animated.View>
  );
}

function TodaysWorkoutSection({
  workouts,
  activePlanId,
}: {
  workouts: Workout[];
  activePlanId: string | null;
}) {
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
              No workouts scheduled for {DAY_LABELS[new Date().getDay()]}
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

export default function Index() {
  const { session } = useAuth();

  useEffect(() => {
    if (!session) router.replace("/login");
  }, [session]);

  configureReanimatedLogger({ level: ReanimatedLogLevel.warn, strict: false });

  const [collapsed] = useState(false);
  const [isLoading] = useState(false);
  const [multiPickerVisible, setMultiPickerVisible] = useState(false);

  const { activePlanId } = useActivePlan();
  const { workouts: todaysWorkouts } = useTodaysWorkouts();
  const { activeSession } = useActiveSession();
  const { startSession } = useStartSession();

  useEffect(() => {
    const hideNav = async () => {
      await NavigationBar.setVisibilityAsync("hidden");
      await NavigationBar.setBehaviorAsync("overlay-swipe");
    };
    hideNav();
  }, []);

  const hasActiveSession = !!activeSession;
  const isRestDay = !!activePlanId && todaysWorkouts.length === 0;
  const hasNoActivePlan = !activePlanId;

  function handleStartWorkout() {
    if (hasActiveSession) {
      router.push(`/(tabs)/Workouts/session?id=${activeSession!.id}` as any);
      return;
    }
    if (todaysWorkouts.length === 1) {
      const sessionId = startSession(todaysWorkouts[0]);
      router.push(`/(tabs)/Workouts/session?id=${sessionId}` as any);
      return;
    }
    if (todaysWorkouts.length > 1) {
      setMultiPickerVisible(true);
    }
  }

  function handlePickWorkout(workout: Workout) {
    setMultiPickerVisible(false);
    const sessionId = startSession(workout);
    router.push(`/(tabs)/Workouts/session?id=${sessionId}` as any);
  }

  const buttonDisabled = !hasActiveSession && (isRestDay || hasNoActivePlan);
  const buttonLabel = hasActiveSession
    ? "Resume Workout"
    : isRestDay
    ? "Rest Day"
    : hasNoActivePlan
    ? "No Active Plan"
    : "Start Workout";

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      {/* Ambient atmospheric gradient */}
      <LinearGradient
        colors={["rgba(52,211,153,0.07)", "transparent"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 0.35 }}
        style={StyleSheet.absoluteFillObject}
        pointerEvents="none"
      />

      <View style={styles.container}>
        <LoadingOverlay isVisible={isLoading} />

        <Popup
          isVisible={multiPickerVisible}
          onClose={() => setMultiPickerVisible(false)}
          message="Choose a workout to start"
          buttons={todaysWorkouts.map((w) => ({
            text: w.name,
            onPress: () => handlePickWorkout(w),
            style: "default" as const,
          }))}
        />

        <BlurOverlay
          collapsed={collapsed}
          style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 1 }}
        />

        <UserInfoCard />

        <ScrollView
          style={{ backgroundColor: "transparent" }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          <ScheduleBar />

          <SectionLabel eyebrow="Daily Focus" title="Today" delay={80} />
          <TodaysWorkoutSection workouts={todaysWorkouts} activePlanId={activePlanId} />

          <SectionLabel eyebrow="Performance" title="Your Progress" delay={220} />

          <View style={{ gap: 14 }}>
            <HomePageChartGraph />
            <ProgressiveOverload />
            {/* <WeeklyVolume /> */}
          </View>

          <View style={styles.divider} />

          <PersonalRecord />
          <Insights />
        </ScrollView>

        <Animated.View entering={FadeInDown.delay(600).duration(400)} style={styles.bottomArea}>
          <TouchableOpacity
            activeOpacity={buttonDisabled ? 1 : 0.85}
            onPress={buttonDisabled ? undefined : handleStartWorkout}
            style={[
              styles.bottomButton,
              buttonDisabled && { borderColor: Palette.hairlineStrong, opacity: 0.6 },
            ]}
          >
            <Text style={styles.bottomButtonText}>{buttonLabel}</Text>
            <View style={styles.bottomButtonGlyph}>
              <Ionicons
                name={hasActiveSession ? "play-skip-forward" : "play"}
                size={12}
                color={buttonDisabled ? Palette.mutedSoft : Palette.accent}
              />
            </View>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Palette.ink },
  container: { flex: 1, backgroundColor: "transparent" },

  sectionHead: {
    paddingHorizontal: 20,
    marginTop: 18,
    marginBottom: 12,
  },
  eyebrow: {
    color: Palette.accent,
    fontSize: 9,
    fontFamily: FontFamilies.medium,
    letterSpacing: 2.4,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  sectionTitle: {
    color: Palette.bone,
    fontSize: 22,
    fontFamily: FontFamilies.displayMedium,
    letterSpacing: -0.4,
  },

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

  divider: {
    marginHorizontal: 20,
    marginVertical: 22,
    height: StyleSheet.hairlineWidth,
    backgroundColor: Palette.hairlineStrong,
  },

  bottomArea: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 14 },
  bottomButton: {
    height: 56,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
    backgroundColor: Palette.inkRaised,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Palette.accentBorder,
  },
  bottomButtonText: {
    color: Palette.bone,
    fontSize: 12,
    fontFamily: FontFamilies.displayMedium,
    letterSpacing: 2.4,
    textTransform: "uppercase",
  },
  bottomButtonGlyph: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Palette.accentBorder,
    alignItems: "center",
    justifyContent: "center",
  },
});
