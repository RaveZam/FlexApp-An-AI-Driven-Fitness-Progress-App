import { TouchableOpacity, View } from "react-native";
import { ThemedText } from "../ThemedText";

export default function WorkoutPlanCard({
  plan,
  onPress,
}: {
  plan: any;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`rounded-lg  bg-lightDark overflow-hidden mt-4 p-4 px-6 ${
        plan.is_active ? "border border-black" : "border border-gray-300"
      }`}
      activeOpacity={0.7}
    >
      <View className="flex-row justify-between items-center">
        <View className="flex-1">
          <ThemedText className="text-lg font-medium opacity-90 mb-2">
            {plan.name}
          </ThemedText>
          {plan.description && (
            <ThemedText className="text-sm opacity-60 mb-2">
              {plan.description}
            </ThemedText>
          )}
          <ThemedText className="text-xs opacity-50">
            Created: {new Date(plan.created_at).toLocaleDateString()}
          </ThemedText>
        </View>
        <View className="ml-4">
          <ThemedText className="text-xs opacity-50">Tap to view</ThemedText>
        </View>
      </View>
    </TouchableOpacity>
  );
}
