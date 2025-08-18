import "react-native-reanimated";

import { useAuth } from "@/auth/useAuth";
import HomePageChartGraph from "@/components/HomePageChartGraph";
import { ThemedView } from "@/components/ThemedView";
import BlurOverlay from "@/components/ui/BlurOverlay";
import Button from "@/components/ui/Button";
import LoadingOverlay from "@/components/ui/LoadingOverlay";
import Popup from "@/components/ui/Popup";
import ScheduleBar from "@/components/ui/ScheduleBar";
import UserInfoCard from "@/components/UserInfoCard";
import Workoutlist from "@/components/Workout/Workoutlist";
import { useWorkoutContext } from "@/hooks/useWorkoutPlanContext";
import { useWorkoutSession } from "@/hooks/useWorkoutSession";
import { useStartWorkoutSession } from "@/hooks/WorkoutHooks/useStartWorkoutSession";
import * as NavigationBar from "expo-navigation-bar";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import "../../global.css";

export default function Index() {
  const { session, user } = useAuth();

  useEffect(() => {
    if (!session) {
      router.replace("/login");
    } else if (user) {
    }
  }, [session, user]);

  // This is the default configuration
  configureReanimatedLogger({
    level: ReanimatedLogLevel.warn,
    strict: false, // Reanimated runs in strict mode by default
  });
  const { checkWorkoutSession } = useWorkoutSession();
  const { activeWorkoutSession, currentSessionStatus } = useWorkoutContext();

  const [collapsed, setCollapsed] = useState(false);
  const [popup, setPopup] = useState(false);
  const [isLoading, setisLoading] = useState(false);

  const { startWorkoutSession, resumeWorkoutSession } =
    useStartWorkoutSession();

  checkWorkoutSession();

  const handleStartWorkout = async () => {
    if (activeWorkoutSession) {
      resumeWorkoutSession();
    } else {
      startWorkoutSession();
    }
  };

  useEffect(() => {
    const hideNav = async () => {
      await NavigationBar.setVisibilityAsync("hidden");
      await NavigationBar.setBehaviorAsync("overlay-swipe");
    };
    hideNav();
  }, []);

  return (
    <SafeAreaView className="flex-1" edges={["top"]}>
      <ThemedView className="flex-col h-full" colorToken="background">
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
              onPress: handleStartWorkout,
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
        <ScrollView showsHorizontalScrollIndicator={false} className="h-[20%]">
          <ScheduleBar />
          <HomePageChartGraph />
        </ScrollView>
        <View className="flex-1" style={{ zIndex: 2, position: "relative" }}>
          <Workoutlist collapsed={collapsed} setCollapsed={setCollapsed} />
        </View>

        <Button
          className="z-20"
          buttonText={
            currentSessionStatus == "completed" && activeWorkoutSession
              ? "Workout Finished"
              : activeWorkoutSession
              ? "Resume Session"
              : "Start Session"
          }
          onPress={() => {
            currentSessionStatus === "completed"
              ? handleStartWorkout()
              : setPopup(true);
          }}
        />
      </ThemedView>
    </SafeAreaView>
  );
}
