import "react-native-reanimated";

import HomePageChartGraph from "@/components/HomePageChartGraph";
import BlurOverlay from "@/components/ui/BlurOverlay";
import Button from "@/components/ui/Button";
import LoadingOverlay from "@/components/ui/LoadingOverlay";
import Popup from "@/components/ui/Popup";
import ScheduleBar from "@/components/ui/ScheduleBar";
import UserInfoCard from "@/components/UserInfoCard";
import Workoutlist from "@/components/Workout/Workoutlist";
import { useStartWorkoutSession } from "@/hooks/WorkoutHooks/useStartWorkoutSession";
import { useState } from "react";
import { ScrollView, View } from "react-native";
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from "react-native-reanimated";
import "../../global.css";

export default function Index() {
  // This is the default configuration
  configureReanimatedLogger({
    level: ReanimatedLogLevel.warn,
    strict: false, // Reanimated runs in strict mode by default
  });
  const [collapsed, setCollapsed] = useState(false);
  const [popup, setPopup] = useState(false);
  const [isLoading, setisLoading] = useState(false);

  const { startWorkoutSession } = useStartWorkoutSession();

  const handleStartWorkout = async () => {
    startWorkoutSession();
  };

  return (
    <View className="flex-col h-full">
      <LoadingOverlay isVisible={isLoading} />

      <Popup
        isVisible={popup}
        onClose={() => setPopup(false)}
        // iconName="questioncircleo"
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
        buttonText="Start Session"
        onPress={() => setPopup(true)}
      />
    </View>
  );
}
