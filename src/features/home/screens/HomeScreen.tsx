import "react-native-reanimated";

import { useAuth } from "@/src/features/auth/hooks/useAuth";
import {
  HomePageChartGraph,
  Insights,
  PersonalRecord,
  ProgressiveOverload,
  WeeklyVolume,
} from "@/src/features/home/components";
import { useActiveSession } from "@/src/features/workouts/hooks/useActiveSession";
import { useActivePlan } from "@/src/features/workouts/hooks/useActivePlan";
import { useStartSession } from "@/src/features/workouts/hooks/useStartSession";
import { useTodaysWorkouts } from "@/src/features/workouts/hooks/useTodaysWorkouts";
import type { Workout } from "@/src/features/workouts/types";
import BlurOverlay from "@/components/ui/BlurOverlay";
import LoadingOverlay from "@/components/ui/LoadingOverlay";
import Popup from "@/components/ui/Popup";
import ScheduleBar from "@/components/ui/ScheduleBar";
import UserInfoCard from "@/components/UserInfoCard";

import { Ionicons } from "@expo/vector-icons";
import * as NavigationBar from "expo-navigation-bar";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import "@/global.css";

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function TodaysWorkoutSection({ workouts, activePlanId }: { workouts: Workout[]; activePlanId: string | null }) {
  if (!activePlanId) {
    return (
      <Animated.View
        entering={FadeInDown.delay(100).duration(400)}
        style={{ marginHorizontal: 20, marginBottom: 16 }}
      >
        <View
          style={{
            backgroundColor: "#191919",
            borderRadius: 14,
            padding: 16,
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.04)",
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
          }}
        >
          <View
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              backgroundColor: "rgba(255,255,255,0.04)",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="barbell-outline" size={18} color="#444" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: "#aaa", fontSize: 13, fontFamily: "Inter_500Medium" }}>
              No active plan
            </Text>
            <TouchableOpacity onPress={() => router.push("/(tabs)/Workouts" as any)}>
              <Text style={{ color: "#10b981", fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 2 }}>
                Select a plan →
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    );
  }

  if (workouts.length === 0) {
    return (
      <Animated.View
        entering={FadeInDown.delay(100).duration(400)}
        style={{ marginHorizontal: 20, marginBottom: 16 }}
      >
        <View
          style={{
            backgroundColor: "#191919",
            borderRadius: 14,
            padding: 16,
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.04)",
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
          }}
        >
          <View
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              backgroundColor: "rgba(255,255,255,0.04)",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="bed-outline" size={18} color="#444" />
          </View>
          <View>
            <Text style={{ color: "#aaa", fontSize: 13, fontFamily: "Inter_500Medium" }}>
              Rest day
            </Text>
            <Text style={{ color: "#555", fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 2 }}>
              No workouts scheduled for {DAY_LABELS[new Date().getDay()]}
            </Text>
          </View>
        </View>
      </Animated.View>
    );
  }

  return (
    <Animated.View
      entering={FadeInDown.delay(100).duration(400)}
      style={{ marginHorizontal: 20, marginBottom: 16, gap: 8 }}
    >
      {workouts.map((w) => (
        <View
          key={w.id}
          style={{
            backgroundColor: "#191919",
            borderRadius: 14,
            overflow: "hidden",
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.04)",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <View style={{ width: 3, alignSelf: "stretch", backgroundColor: "#10b981", opacity: 0.7 }} />
          <View style={{ flex: 1, padding: 14 }}>
            <Text style={{ color: "#fff", fontSize: 14, fontFamily: "Inter_600SemiBold" }}>
              {w.name}
            </Text>
            <Text style={{ color: "#555", fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 3 }}>
              {w.exercises.length} exercise{w.exercises.length !== 1 ? "s" : ""}
            </Text>
          </View>
        </View>
      ))}
    </Animated.View>
  );
}

export default function Index() {
  const { session, user } = useAuth();

  useEffect(() => {
    if (!session) {
      router.replace("/login");
    }
  }, [session]);

  configureReanimatedLogger({
    level: ReanimatedLogLevel.warn,
    strict: false,
  });

  const [collapsed, setCollapsed] = useState(false);
  const [popup, setPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [multiPickerVisible, setMultiPickerVisible] = useState(false);

  const { activePlanId } = useActivePlan();
  const { workouts: todaysWorkouts, loading: workoutsLoading } = useTodaysWorkouts();
  const { activeSession } = useActiveSession();
  const { startSession } = useStartSession();

  useEffect(() => {
    const hideNav = async () => {
      await NavigationBar.setVisibilityAsync("hidden");
      await NavigationBar.setBehaviorAsync("overlay-swipe");
    };
    hideNav();
  }, []);

  const btnScale = useSharedValue(1);
  const btnStyle = useAnimatedStyle(() => ({
    transform: [{ scale: btnScale.value }],
  }));

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
      return;
    }
    // Rest day or no plan — do nothing (button is disabled)
  }

  function handlePickWorkout(workout: Workout) {
    setMultiPickerVisible(false);
    const sessionId = startSession(workout);
    router.push(`/(tabs)/Workouts/session?id=${sessionId}` as any);
  }

  const buttonDisabled = !hasActiveSession && (isRestDay || hasNoActivePlan);
  const buttonLabel = hasActiveSession ? "Resume Workout" : "Start Workout";

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0f0f0f" }} edges={["top"]}>
      <View style={{ flex: 1, backgroundColor: "#0f0f0f" }}>
        <LoadingOverlay isVisible={isLoading} />

        {/* Multi-workout picker */}
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
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1,
          }}
        />

        <UserInfoCard />

        <ScrollView
          style={{ backgroundColor: "#0f0f0f" }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 16 }}
        >
          <ScheduleBar />

          {/* Today's Workout */}
          <Animated.View
            entering={FadeInDown.delay(80).duration(400)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              paddingHorizontal: 20,
              marginTop: 8,
              marginBottom: 10,
            }}
          >
            <View style={{ width: 4, height: 18, borderRadius: 2, backgroundColor: "#10b981" }} />
            <Text
              style={{
                color: "#ffffff",
                fontSize: 16,
                fontFamily: "Inter_600SemiBold",
                letterSpacing: 0.3,
              }}
            >
              Today
            </Text>
          </Animated.View>

          <TodaysWorkoutSection workouts={todaysWorkouts} activePlanId={activePlanId} />

          {/* Stats section header */}
          <Animated.View
            entering={FadeInDown.delay(200).duration(400)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              paddingHorizontal: 20,
              marginTop: 8,
              marginBottom: 14,
            }}
          >
            <View
              style={{
                width: 4,
                height: 18,
                borderRadius: 2,
                backgroundColor: "#10b981",
              }}
            />
            <Text
              style={{
                color: "#ffffff",
                fontSize: 16,
                fontFamily: "Inter_600SemiBold",
                letterSpacing: 0.3,
              }}
            >
              Your Progress
            </Text>
          </Animated.View>

          <View style={{ gap: 12 }}>
            <HomePageChartGraph />
            <WeeklyVolume />
            <PersonalRecord />
            <ProgressiveOverload />
          </View>

          <View
            style={{
              marginHorizontal: 20,
              marginVertical: 20,
              height: 1,
              backgroundColor: "rgba(255,255,255,0.04)",
            }}
          />

          <Insights />
        </ScrollView>

        {/* Start / Resume Workout CTA */}
        <Animated.View
          entering={FadeInDown.delay(600).duration(400)}
          style={{ paddingHorizontal: 16, paddingBottom: 12 }}
        >
          <TouchableOpacity
            activeOpacity={buttonDisabled ? 1 : 0.85}
            onPress={buttonDisabled ? undefined : handleStartWorkout}
            style={{
              backgroundColor: buttonDisabled ? "#1a1a1a" : "#10b981",
              borderRadius: 14,
              paddingVertical: 16,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              borderWidth: buttonDisabled ? 1 : 0,
              borderColor: "rgba(255,255,255,0.06)",
            }}
          >
            <View
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                backgroundColor: "rgba(255,255,255,0.2)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons
                name={hasActiveSession ? "play-skip-forward" : "play"}
                size={16}
                color={buttonDisabled ? "#444" : "#ffffff"}
              />
            </View>
            <Text
              style={{
                color: buttonDisabled ? "#444" : "#ffffff",
                fontSize: 16,
                fontFamily: "Inter_700Bold",
                letterSpacing: 0.5,
              }}
            >
              {isRestDay ? "Rest Day" : hasNoActivePlan ? "No Active Plan" : buttonLabel}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}
