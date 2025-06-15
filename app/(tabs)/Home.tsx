import { ThemedView } from "@/components/ThemedView";
import "react-native-reanimated";

import HomePageChartGraph from "@/components/HomePageChartGraph";
import Button from "@/components/ui/Button";
import ScheduleBar from "@/components/ui/ScheduleBar";
import UserInfoCard from "@/components/UserInfoCard";
import Workoutlist from "@/components/Workout/Workoutlist";

import "../../global.css";

export default function Index() {
  return (
    <ThemedView className="h-full">
      <UserInfoCard />

      <ScheduleBar />
      <HomePageChartGraph />
      <Workoutlist />

      <Button buttonText="Start Workout" onPress={() => {}} />
    </ThemedView>
  );
}
