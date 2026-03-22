import { Text, View } from "react-native";
import { ThemedText } from "@/components/ThemedText";

export default function WorkoutTimers({
  formatTime,
  time,
}: {
  formatTime: (time: number) => string;
  time: number;
}) {
  return (
    <View className="flex-row justify-between items-center mx-4 px-4 py-3">
      <View className="items-center">
        <Text className="text-mutedText text-sm">Time</Text>
        <ThemedText className="text-lg ">{formatTime(time)}</ThemedText>
      </View>
      <View className="items-center">
        <Text className="text-mutedText text-sm">Rest Time</Text>
        <ThemedText className="text-lg ">3:00</ThemedText>
      </View>
    </View>
  );
}
