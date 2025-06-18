import { ThemedText } from "@/components/ThemedText";
import Button from "@/components/ui/Button";
import { useWorkoutContext } from "@/hooks/useWorkoutPlanContext";
import { ScrollView, View } from "react-native";
import EditWorkoutCard from "./components/EditWorkoutCard";

export default function Summary() {
  const { repsPerSet, setRepsPerSet, selectedPlan } = useWorkoutContext();

  const handleUpdate = (id: number, field: string, value: any) => {
    setRepsPerSet((prev) =>
      prev.map((workout) =>
        workout.id === id ? { ...workout, [field]: value } : workout
      )
    );
  };

  return (
    <View className="flex-1 mt-16">
      <ThemedText className="text-2xl text-center">Push Day Summary</ThemedText>
      <ScrollView className="mt-4" showsVerticalScrollIndicator={false}>
        {repsPerSet.map((workout) => (
          <EditWorkoutCard
            key={workout.id}
            workout={workout}
            onUpdate={handleUpdate}
          />
        ))}
      </ScrollView>
      <Button buttonText={selectedPlan} onPress={() => {}} />
    </View>
  );
}
