import "react-native-reanimated";

import HomePageChartGraph from "@/components/HomePageChartGraph";
import BlurOverlay from "@/components/ui/BlurOverlay";
import ScheduleBar from "@/components/ui/ScheduleBar";
import UserInfoCard from "@/components/UserInfoCard";
import Workoutlist from "@/components/Workout/Workoutlist";

import Button from "@/components/ui/Button";
import { useState } from "react";
import { View } from "react-native";
import "../../global.css";

export default function Index() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <View className="relative h-full overflow-hidden">
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
      <ScheduleBar />
      <HomePageChartGraph />
      <View className="flex-1" style={{ zIndex: 2, position: "relative" }}>
        <Workoutlist collapsed={collapsed} setCollapsed={setCollapsed} />
      </View>
      <Button className="" buttonText="Start Workout" onPress={() => {}} />
    </View>
  );
}
