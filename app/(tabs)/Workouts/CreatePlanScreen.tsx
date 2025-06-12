import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import Button from "@/components/ui/Button";
import { View } from "react-native";

export default function SelectWorkoutPlan() {
  return (
    <ThemedView className="flex-1 items-center justify-center">
      <View className="items-center justify-center bg-[#191818] h-1/2 w-4/5 rounded-[38px] ">
        <ThemedText className="text-xl mb-8">Select A Plan</ThemedText>
        <View className="gap-1 w-full ">
          <Button buttonText="Push Pull Legs" onPress={() => {}} />
          <Button buttonText="Upper Lower" onPress={() => {}} />
          <Button buttonText="Custom" onPress={() => {}} />
        </View>

        <View className="items-center justify-center mt-4">
          <ThemedText>Start Your Week On:</ThemedText>
          <View className="flex-row items-center justify-center gap-2 mt-4">
            <View className="bg-[#222222] p-2 rounded-md">
              <ThemedText>Mon</ThemedText>
            </View>

            <View className="bg-[#222222] p-2 rounded-md">
              <ThemedText>Tue</ThemedText>
            </View>

            <View className="bg-[#222222] p-2 rounded-md">
              <ThemedText>Wed</ThemedText>
            </View>

            <View className="bg-[#222222] p-2 rounded-md">
              <ThemedText>Thu</ThemedText>
            </View>

            <View className="bg-[#222222] p-2 rounded-md">
              <ThemedText>Fri</ThemedText>
            </View>

            <View className="bg-[#222222] p-2 rounded-md">
              <ThemedText>Sat</ThemedText>
            </View>

            <View className="bg-[#222222] p-2 rounded-md">
              <ThemedText>Sun</ThemedText>
            </View>
          </View>
        </View>
      </View>
    </ThemedView>
  );
}
