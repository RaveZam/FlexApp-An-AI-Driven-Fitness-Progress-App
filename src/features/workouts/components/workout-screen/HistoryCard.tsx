import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import BarGraph from "@/components/ui/BarGraph";
import { View } from "react-native";

export default function HistoryCard() {
  return (
    <ThemedView className="flex-1 items-center">
      <ThemedText className="text-mutedText text-sm ">History</ThemedText>
      <View className="bg-lightDark rounded-lg w-full justify-center items-center">
        <BarGraph />
      </View>
    </ThemedView>
  );
}
