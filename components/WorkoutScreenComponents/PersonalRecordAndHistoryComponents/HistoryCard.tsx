import { ThemedText } from "@/components/ThemedText";
import LineChart from "@/components/ui/LineChart";
import { View } from "react-native";

export default function HistoryCard() {
  return (
    <View className="flex-1 items-center">
      <ThemedText className="text-mutedText text-sm mb-2">History</ThemedText>
      <View className="bg-lightDark rounded-lg w-full justify-center items-center">
        <LineChart />
      </View>
    </View>
  );
}
