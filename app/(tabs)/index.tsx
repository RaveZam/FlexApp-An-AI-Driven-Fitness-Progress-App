import "react-native-reanimated";

import HomePageChartGraph from "@/components/HomePageChartGraph";
import ScheduleBar from "@/components/ui/ScheduleBar";
import UserInfoCard from "@/components/UserInfoCard";
import Workoutlist from "@/components/Workout/Workoutlist";

import Button from "@/components/ui/Button";
import { View } from "react-native";
import "../../global.css";

export default function Index() {
  return (
    <View className="flex-col h-full overflow-hidden">
      <UserInfoCard />
      <ScheduleBar />

      <HomePageChartGraph />
      <Workoutlist />
      <Button className="" buttonText="Start Workout" onPress={() => {}} />
    </View>
  );
}
