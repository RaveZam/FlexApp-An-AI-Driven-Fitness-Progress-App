import "react-native-reanimated";

import { useAuth } from "@/src/features/auth/hooks/useAuth";
import {
  HomePageChartGraph,
  Insights,
  PersonalRecord,
  ProgressiveOverload,
  WeeklyVolume,
} from "@/src/features/home/components";
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
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import "@/global.css";

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
  const [isLoading, setisLoading] = useState(false);

  useEffect(() => {
    const hideNav = async () => {
      await NavigationBar.setVisibilityAsync("hidden");
      await NavigationBar.setBehaviorAsync("overlay-swipe");
    };
    hideNav();
  }, []);

  // Animated start button
  const btnScale = useSharedValue(1);
  const btnStyle = useAnimatedStyle(() => ({
    transform: [{ scale: btnScale.value }],
  }));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0f0f0f" }} edges={["top"]}>
      <View style={{ flex: 1, backgroundColor: "#0f0f0f" }}>
        <LoadingOverlay isVisible={isLoading} />

        <Popup
          isVisible={popup}
          onClose={() => setPopup(false)}
          message="Are you ready for your Workout?"
          buttons={[
            {
              text: "No",
              onPress: () => setPopup(false),
              style: "destructive",
            },
            {
              text: "Yes",
              onPress: () => {
                setPopup(false);
                router.push("/(tabs)/Workouts/session" as any);
              },
              style: "default",
            },
          ]}
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
          {/* Schedule section */}
          <ScheduleBar />

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

          {/* Divider */}
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

        {/* Start Workout CTA */}
        <Animated.View
          entering={FadeInDown.delay(600).springify().damping(18)}
          style={{ paddingHorizontal: 16, paddingBottom: 12 }}
        >
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => setPopup(true)}
            style={{
              backgroundColor: "#10b981",
              borderRadius: 14,
              paddingVertical: 16,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
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
              <Ionicons name="play" size={16} color="#ffffff" />
            </View>
            <Text
              style={{
                color: "#ffffff",
                fontSize: 16,
                fontFamily: "Inter_700Bold",
                letterSpacing: 0.5,
              }}
            >
              Start Workout
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}
