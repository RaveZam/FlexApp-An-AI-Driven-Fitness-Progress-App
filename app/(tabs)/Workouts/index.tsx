import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import Button from "@/components/ui/Button";
import WorkoutPlanCard from "@/components/Workout/WorkoutPlanCard";
import { useFetchWorkoutPlans } from "@/hooks/useFetchWorkoutPlans";
import { useRouter } from "expo-router";
import { ActivityIndicator, ScrollView, View } from "react-native";

export default function index() {
  const router = useRouter();
  const { workoutPlans, loading, error } = useFetchWorkoutPlans();

  if (loading) {
    return (
      <ThemedView className="flex-1 justify-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </ThemedView>
    );
  }

  return (
    <ThemedView className="flex-1">
      <View className="m-4 flex-1">
        <ThemedText className="text-2xl font-medium mb-4">
          Your Workout Plans
        </ThemedText>

        {workoutPlans && workoutPlans.length > 0 ? (
          <ScrollView
            showsVerticalScrollIndicator={false}
            alwaysBounceVertical={true}
            className="flex-1"
          >
            {workoutPlans.map((plan: any) => (
              <WorkoutPlanCard
                key={plan.id}
                plan={plan}
                onPress={() => {
                  // Navigate to plan details screen
                  router.push({
                    pathname: "/Workouts/PlanDetails" as never,
                    params: { planId: plan.id, planName: plan.name },
                  });
                }}
              />
            ))}
          </ScrollView>
        ) : (
          <View className="flex-1 justify-center items-center">
            <ThemedText className="text-center text-lg font-medium opacity-60 mb-4">
              You Have No Workout Plans...
            </ThemedText>
            <ThemedText className="text-center text-sm opacity-50">
              Create your first workout plan to get started!
            </ThemedText>
          </View>
        )}
      </View>

      <View className="p-4">
        <Button
          buttonText="Create Workout"
          onPress={() => router.push("/Workouts/CreatePlanScreen" as never)}
        />
      </View>
    </ThemedView>
  );
}
