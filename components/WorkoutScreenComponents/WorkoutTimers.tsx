import { Text, View } from "react-native";

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
        <Text className="text-emerald-500 text-lg ">{formatTime(time)}</Text>
      </View>
      <View className="items-center">
        <Text className="text-mutedText text-sm">Rest Time</Text>
        <Text className="text-emerald-400 text-lg ">3:00</Text>
      </View>
    </View>
  );
}
