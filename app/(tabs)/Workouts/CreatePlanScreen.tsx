import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import Button from "@/components/ui/Button";
import { usePlanStarter } from "@/hooks/WorkoutHooks/usePlanStarter";
import { router } from "expo-router";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SelectDayComponent from "./components/SelectDayComponent";

export default function SelectWorkoutPlan() {
  const { handleStartPlan } = usePlanStarter();
  return (
    <SafeAreaView className="flex-1">
      <ThemedView className="flex-1 items-center justify-center">
        <View className="items-center justify-center bg-[#191818] h-1/2 w-4/5 rounded-[38px] ">
          <ThemedText className="text-xl mb-8">Select A Plan</ThemedText>
          <View className="gap-1 w-full">
            <Button
              className=""
              buttonText="Push Pull Legs"
              onPress={() => {
                handleStartPlan("Push Pull Legs");
              }}
            />
            <Button
              className=""
              buttonText="Upper Lower"
              onPress={() => {
                handleStartPlan("Upper Lower");
              }}
            />
            <Button
              className=""
              buttonText="Custom"
              onPress={() => {
                router.push("/Workouts/CustomWorkoutCreator" as never);
              }}
            />
          </View>
          <SelectDayComponent />
        </View>
      </ThemedView>
    </SafeAreaView>
  );
}
