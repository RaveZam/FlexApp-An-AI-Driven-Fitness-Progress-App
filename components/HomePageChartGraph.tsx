import { View } from "react-native";
import { ThemedText } from "./ThemedText";
import MyChart from "./ui/AreaChart";

export default function HomePageChartGraph() {
  return (
    <View className="mx-8 mt-4">
      <ThemedText className="text-lg font-medium">
        Your Workout Progress This Month
      </ThemedText>
      <ThemedText className="text-md font-medium opacity-50 italic">
        (Based on your Activity)
      </ThemedText>

      <MyChart />
      <ThemedText className="text-lg font-medium opacity-90">
        Your Lifts has Increased by 2% per week this month.
      </ThemedText>
    </View>
  );
}
