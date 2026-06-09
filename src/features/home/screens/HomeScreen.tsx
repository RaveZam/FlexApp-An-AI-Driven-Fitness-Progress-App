import "@/global.css";
import "react-native-reanimated";

import BlurOverlay from "@/components/ui/BlurOverlay";
import LoadingOverlay from "@/components/ui/LoadingOverlay";
import Popup from "@/components/ui/Popup";
import UserInfoCard from "@/components/UserInfoCard";
import { FontFamilies, Palette } from "@/constants/theme";
import {
  ProgressiveOverload,
  ScheduleBar,
  TodaysWorkoutSection
} from "@/src/features/home/components";
import { useHideNavigationBar } from "@/src/features/home/hooks/useHideNavigationBar";
import { useHomeScreen } from "@/src/features/home/hooks/useHomeScreen";

import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  configureReanimatedLogger,
  FadeInDown,
  ReanimatedLogLevel,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

configureReanimatedLogger({ level: ReanimatedLogLevel.warn, strict: false });

export default function Index() {
  const [collapsed] = useState(false);
  const [isLoading] = useState(false);

  useHideNavigationBar();

  const {
    activePlanId,
    todaysWorkouts,
    hasActiveSession,
    multiPickerVisible,
    closeMultiPicker,
    handleStartWorkout,
    handlePickWorkout,
    buttonLabel,
    buttonDisabled,
  } = useHomeScreen();

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

        <Popup
          isVisible={multiPickerVisible}
          onClose={closeMultiPicker}
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
 
          <TodaysWorkoutSection workouts={todaysWorkouts} activePlanId={activePlanId} />

         

          <View style={{ gap: 14 }}>
            {/* <HomePageChartGraph />x */}
            <ProgressiveOverload />
            {/* <WeeklyVolume /> */}
          </View>

          <View style={styles.divider} />

          {/* <PersonalRecord /> */}
          {/* <Insights /> */}
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
