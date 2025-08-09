import { useWorkoutContext } from "@/hooks/useWorkoutPlanContext";
import { router } from "expo-router";
import { TouchableOpacity, View } from "react-native";
import { ThemedText } from "../ThemedText";

export default function WorkoutScreenHeader({
  setShowExercisesModal,
}: {
  setShowExercisesModal: (show: boolean) => void;
}) {
  const { finishedWorkouts } = useWorkoutContext();
  return (
    <View className="flex-row justify-between items-center ml-12 mx-8 py-8 border-b border-important">
      <TouchableOpacity onPress={() => router.back()}>
        <ThemedText className="text-whiteText">Exit</ThemedText>
      </TouchableOpacity>
      <ThemedText className="text-whiteText font-medium">
        Workout {finishedWorkouts.length}/{finishedWorkouts.length + 1}
      </ThemedText>
      <TouchableOpacity onPress={() => setShowExercisesModal(true)}>
        <ThemedText className="text-whiteText">Exercises</ThemedText>
      </TouchableOpacity>
    </View>
  );
}
