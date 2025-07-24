import "react-native-reanimated";

import HomePageChartGraph from "@/components/HomePageChartGraph";
import ScheduleBar from "@/components/ui/ScheduleBar";
import UserInfoCard from "@/components/UserInfoCard";
import Workoutlist from "@/components/Workout/Workoutlist";

import Button from "@/components/ui/Button";
import { useState } from "react";
import { View } from "react-native";
import "../../global.css";

export default function Index() {
  const [toggled, setToggled] = useState(false);
  return (
    <View className="relative h-full overflow-hidden">
      <UserInfoCard />
      <ScheduleBar />

      <View className="flex-1">
        <HomePageChartGraph toggled={toggled} setToggled={setToggled} />
        <Workoutlist className={toggled ? "relative" : "absolute"} />
      </View>
      <Button className="" buttonText="Start Workout" onPress={() => {}} />
    </View>
  );
}
