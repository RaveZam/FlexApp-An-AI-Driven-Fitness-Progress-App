import { ThemedView } from "@/components/ThemedView";
import "react-native-reanimated";

import HomePageChartGraph from "@/components/HomePageChartGraph";
import ScheduleBar from "@/components/ui/ScheduleBar";
import UserInfoCard from "@/components/UserInfoCard";
import { Text, TouchableOpacity } from "react-native";
import "../../global.css";

export default function Index() {
  return (
    <ThemedView className="h-full">
      <UserInfoCard />

      <ScheduleBar />
      <HomePageChartGraph />

      <TouchableOpacity className="bg-[#BFFA00] m-4  p-4 rounded-full mt-auto">
        <Text className="text-center text-black text-lg font-semibold">
          Start Workout
        </Text>
      </TouchableOpacity>
    </ThemedView>
  );
}
