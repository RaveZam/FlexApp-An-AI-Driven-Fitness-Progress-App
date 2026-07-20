import "@/global.css";
import "react-native-reanimated";

import ActionButton from "@/components/ui/ActionButton";
import BlurOverlay from "@/components/ui/BlurOverlay";
import LoadingOverlay from "@/components/ui/LoadingOverlay";
import { Palette } from "@/constants/theme";
import {
  PlateauCard,
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
import WorkoutPickerModal from "../components/WorkoutPickerModal";
import useGetActiveSession from "../hooks/useGetActiveSession";
import useGetActiveWorkout from "../hooks/useGetActiveWorkout";
import useHasFinishedWorkoutToday from "../hooks/useHasFinishedWorkoutToday";
import { useStartWorkout } from "../hooks/useStartWorkout";
import { useWorkoutPicker } from "../hooks/useWorkoutPicker";

configureReanimatedLogger({ level: ReanimatedLogLevel.warn, strict: false });

export default function Index() {
  const isRestDay = false;
  const startWorkout = useStartWorkout();
  const activeSession = useGetActiveSession();
  const finishedToday = useHasFinishedWorkoutToday();
  const showFinished = !activeSession && finishedToday;

  const { workout: activeWorkout, refresh: refreshActiveWorkout } =
    useGetActiveWorkout();

  const {
    visible: pickerVisible,
    open: openPicker,
    close: closePicker,
    workouts: pickableWorkouts,
    pickWorkout,
  } = useWorkoutPicker(refreshActiveWorkout);

  const canChangeDay =
    !isRestDay && !activeSession && !showFinished && pickableWorkouts.length > 0;

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

          <TodaysWorkoutSection
            workout={activeWorkout}
            onPress={canChangeDay ? openPicker : undefined}
          />

          <View style={{ gap: 14 }}>
            {/* <HomePageChartGraph />x */}
            <ProgressiveOverload />
            <PlateauCard />
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
            onPress={() => startWorkout()}
            title={
              activeSession
                ? "Resume Workout"
                : showFinished
                ? "Workout Finished"
                : "Start Workout"
            }
            icon={
              activeSession
                ? "play-skip-forward"
                : showFinished
                ? "checkmark-done"
                : "play"
            }
            disabled={isRestDay || showFinished}
          />
        </Animated.View>

        <WorkoutPickerModal
          visible={pickerVisible}
          workouts={pickableWorkouts}
          onPick={pickWorkout}
          onClose={closePicker}
        />
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
