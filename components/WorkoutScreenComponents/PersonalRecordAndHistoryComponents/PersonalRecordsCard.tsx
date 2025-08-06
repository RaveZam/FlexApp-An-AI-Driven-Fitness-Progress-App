import { ThemedText } from "@/components/ThemedText";
import { Text, View } from "react-native";

export default function PersonalRecordsCard() {
  return (
    <View>
      <ThemedText className="text-mutedText font-medium text-md mb-2">
        Personal Record:
      </ThemedText>
      <View className="">
        <View className="flex-row gap-1">
          <Text className="text-sm text-veryMutedText">Weight:</Text>
          <Text className="text-emerald-500 font-semibold text-sm">50lb</Text>
        </View>
        <View className="flex-row gap-1 ">
          <Text className="text-sm text-veryMutedText">Reps:</Text>
          <Text className="text-sm text-emerald-500">9</Text>
        </View>
        <View className="flex-row ">
          <Text className="text-sm text-mutedText">03/21/2025</Text>
        </View>
      </View>
    </View>
  );
}
