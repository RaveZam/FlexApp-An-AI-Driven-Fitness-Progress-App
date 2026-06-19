import "@/global.css";
import "react-native-reanimated";

import ActionButton from "@/components/ui/ActionButton";
import BlurOverlay from "@/components/ui/BlurOverlay";
import LoadingOverlay from "@/components/ui/LoadingOverlay";
import { Palette } from "@/constants/theme";
import {
  ProgressiveOverload,
  ScheduleBar,
  TodaysWorkoutSection,
} from "@/src/features/home/components";
import UserInfoCard from "@/src/features/home/components/UserInfoCard";

import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import Animated, {
  configureReanimatedLogger,
  FadeInDown,
  ReanimatedLogLevel,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import useGetActiveSession from "../hooks/useGetActiveSession";
import { useHandleStartWorkout } from "../hooks/useHandleStartWorkout";

configureReanimatedLogger({ level: ReanimatedLogLevel.warn, strict: false });

export default function Index() {
  const isRestDay = false;
  const handleStartWorkout = useHandleStartWorkout();
  const activeSession = useGetActiveSession();

  const [collapsed] = useState(false);
  const [isLoading] = useState(false);

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <LinearGradient
        colors={["rgba(52,211,153,0.07)", "transparent"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 0.35 }}
        style={StyleSheet.absoluteFillObject}
        pointerEvents="none"
      />

      <View style={styles.container}>
        <LoadingOverlay isVisible={isLoading} />

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
          style={{ backgroundColor: "transparent" }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          <ScheduleBar />

          <TodaysWorkoutSection />

          <View style={{ gap: 14 }}>
            {/* <HomePageChartGraph />x */}
            <ProgressiveOverload />
            {/* <WeeklyVolume /> */}
          </View>

          <View style={styles.divider} />

          {/* <PersonalRecord /> */}
          {/* <Insights /> */}
        </ScrollView>

        <Animated.View
          entering={FadeInDown.delay(600).duration(400)}
          style={styles.bottomArea}
        >
          <ActionButton
            onPress={handleStartWorkout}
            title={activeSession ? "Resume Workout" : "Start Workout"}
            icon={activeSession ? "play-skip-forward" : "play"}
            disabled={isRestDay ? true : false}
          />
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Palette.ink },
  container: { flex: 1, backgroundColor: "transparent" },
  divider: {
    marginHorizontal: 20,
    marginVertical: 22,
    height: StyleSheet.hairlineWidth,
    backgroundColor: Palette.hairlineStrong,
  },
  bottomArea: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 14 },
});
