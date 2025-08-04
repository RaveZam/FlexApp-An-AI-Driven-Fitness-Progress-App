import { ThemedText } from "@/components/ThemedText";
import Button from "@/components/ui/Button";
import Popup from "@/components/ui/Popup";
import { useWorkoutContext } from "@/hooks/useWorkoutPlanContext";
import { useAddSelectedWorkouts } from "@/hooks/WorkoutHooks/useAddSelectedWorkouts";
import { useHandleFinishPopup } from "@/hooks/WorkoutHooks/useHandleFinishPopup";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import EditWorkoutCard from "./components/EditWorkoutCard";

export default function Summary() {
  const {
    getCurrentIndexDay,
    setRepsPerSet,
    repsPerSet,
    initialWorkoutPlan,
    currentStepIndex,
  } = useWorkoutContext();

  const { handleNextDay } = useAddSelectedWorkouts();

  const handleUpdate = (id: number, field: string, value: any) => {
    setRepsPerSet((prev) =>
      prev.map((workout) =>
        workout.id === id ? { ...workout, [field]: value } : workout
      )
    );
  };
  const { showSuccessPopup } = useWorkoutContext();
  const { handleClosePopup } = useHandleFinishPopup();
  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 mt-16">
        <Popup
          isVisible={showSuccessPopup}
          onClose={handleClosePopup}
          iconName="checkcircle"
          iconColor="#10b981"
          message="Workout plan added successfully!"
          buttons={[
            {
              text: "Continue",
              onPress: handleClosePopup,
            },
          ]}
        />
        <ThemedText className="text-2xl text-center">
          {getCurrentIndexDay(initialWorkoutPlan!, currentStepIndex)} Day
          Summary
        </ThemedText>
        <ScrollView className="mt-4" showsVerticalScrollIndicator={false}>
          {repsPerSet.map((workout) => (
            <EditWorkoutCard
              key={workout.id}
              workout={workout}
              onUpdate={handleUpdate}
            />
          ))}
        </ScrollView>
        <Button
          className=""
          buttonText={"Next Day"}
          onPress={() => {
            handleNextDay();
          }}
        />
      </View>
    </SafeAreaView>
  );
}
