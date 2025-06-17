import { ThemedText } from "@/components/ThemedText";
import { useWorkoutContext } from "@/hooks/useWorkoutPlanContext";
import { ScrollView, View } from "react-native";
import EditWorkoutCard from "./components/EditWorkoutCard";

export default function Summary() {
  const { selectedWorkouts } = useWorkoutContext();
  return (
    <View className="flex-1 mt-16">
      <ThemedText className="text-2xl text-center">Summary</ThemedText>
      <ScrollView className="mt-4" showsVerticalScrollIndicator={false}>
        {selectedWorkouts.map((workout) => (
          <EditWorkoutCard key={workout.id} workout={workout} />
        ))}
      </ScrollView>
    </View>
  );
}
