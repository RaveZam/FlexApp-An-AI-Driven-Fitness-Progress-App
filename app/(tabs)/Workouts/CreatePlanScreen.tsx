import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import Button from "@/components/ui/Button";
import { useWorkoutPlanCreator } from "@/hooks/useWorkoutPlanCreator";
import { router } from "expo-router";
import { View } from "react-native";
import SelectDayComponent from "./components/SelectDayComponent";
import { useWorkoutContext } from "@/hooks/useWorkoutPlanContext";

export default function SelectWorkoutPlan() {
  const { setSelectedPlan, selectedPlan } = useWorkoutContext();

  return (
    <ThemedView className="flex-1 items-center justify-center">
      <View className="items-center justify-center bg-[#191818] h-1/2 w-4/5 rounded-[38px] ">
        <ThemedText className="text-xl mb-8">Select A Plan</ThemedText>
        <View className="gap-1 w-full ">
          <Button
            buttonText="Push Pull Legs"
            onPress={() => {
              setSelectedPlan("Push Pull Legs");
              router.push("/Workouts/WorkoutSelector");
            }}
          />
          <Button
            buttonText="Upper Lower"
            onPress={() => setSelectedPlan("Upper Lower")}
          />
          <Button
            buttonText="Custom"
            onPress={() => setSelectedPlan("Custom")}
          />
        </View>
        <SelectDayComponent />
      </View>
    </ThemedView>
  );
}
