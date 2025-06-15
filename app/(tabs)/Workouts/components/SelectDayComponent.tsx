import { ThemedText } from "@/components/ThemedText";
import { useWorkoutContext } from "@/hooks/useWorkoutPlanContext";

import { TouchableOpacity, View } from "react-native";

export default function SelectDayComponent() {
  const { selectedDay, setSelectedDay } = useWorkoutContext();
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <View className="items-center justify-center mt-4">
      <ThemedText>Start Your Week On:</ThemedText>
      <View className="flex-row items-center justify-center gap-2 mt-4">
        {daysOfWeek.map((day) => (
          <TouchableOpacity
            key={day}
            className={`bg-[#222222] p-2 rounded-md  ${
              selectedDay === day ? "bg-[#333333]" : ""
            }`}
            onPress={() => setSelectedDay(day)}
          >
            <ThemedText>{day}</ThemedText>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
