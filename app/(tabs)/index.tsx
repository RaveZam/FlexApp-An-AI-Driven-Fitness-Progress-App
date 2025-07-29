import "react-native-reanimated";

import HomePageChartGraph from "@/components/HomePageChartGraph";
import BlurOverlay from "@/components/ui/BlurOverlay";
import ScheduleBar from "@/components/ui/ScheduleBar";
import UserInfoCard from "@/components/UserInfoCard";
import Workoutlist from "@/components/Workout/Workoutlist";

import Button from "@/components/ui/Button";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, View } from "react-native";
import "../../global.css";

export default function Index() {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();

  const handleStartWorkout = () => {
    router.push("/Workouts/WorkoutScreen" as never);
  };

  return (
    <View className="flex-col h-full">
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
        onPress={handleStartWorkout}
      />
    </View>
  );
}
