import { Colors } from "@/constants";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

export function PersonalRecord() {
  return (
    <ThemedView borderToken="border" className="mx-4 p-4 rounded-lg relative">
      <ThemedView className="flex-row items-center justify-between">
        <ThemedView className="flex-row items-center flex-1">
          <ThemedView
            style={{ backgroundColor: Colors.light.text }}
            className="w-16 h-16 rounded-full items-center justify-center p-4 mr-4"
          >
            <Ionicons name="trophy" size={28} color="white" />
          </ThemedView>

          <ThemedView className="flex-1">
            <ThemedText className="text-lg font-semibold">
              New Squat PR!
            </ThemedText>
            <ThemedText type="subtitle" className="text-sm text-gray-500">
              +10 lbs from last week
            </ThemedText>
          </ThemedView>
        </ThemedView>

        <ThemedView className="ml-4">
          <ThemedText className="text-xl font-semibold">315 lbs</ThemedText>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
}
