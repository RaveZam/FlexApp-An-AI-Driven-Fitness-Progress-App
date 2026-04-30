import Ionicons from "@expo/vector-icons/Ionicons";
import { Text, View } from "react-native";

export function PersonalRecord() {
  return (
    <View className="mx-4 p-4 rounded-xl bg-[#191919] border border-[#1a472a]/20">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center flex-1">
          <View
            className="w-16 h-16 rounded-full items-center justify-center p-4 mr-4"
            style={{ backgroundColor: "#1a472a" }}
          >
            <Ionicons name="trophy" size={28} color="#10b981" />
          </View>

          <View className="flex-1">
            <Text className="text-white text-lg font-semibold">
              New Squat PR!
            </Text>
            <Text className="text-gray-400 text-sm">
              +10 lbs from last week
            </Text>
          </View>
        </View>

        <View className="ml-4">
          <Text className="text-[#10b981] text-xl font-semibold">315 lbs</Text>
        </View>
      </View>
    </View>
  );
}
