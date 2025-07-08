import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import Button from "@/components/ui/Button";
import WorkoutCard from "@/components/Workout/WorkoutCard";
import { useFetchPlanDetails } from "@/hooks/useFetchPlanDetails";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";

export default function PlanDetails() {
  const router = useRouter();
  const { planId, planName } = useLocalSearchParams<{
    planId: string;
    planName: string;
  }>();

  const { planDetails, workouts, loading, error, fetchPlanAndWorkouts } =
    useFetchPlanDetails();

  // Fetch plan details and workouts when component mounts
  useEffect(() => {
    console.log("Plan ID", planId);
    console.log("Plan Name", planName);
    console.log("Workouts", workouts);
    if (planId) {
      fetchPlanAndWorkouts(planId);
    }
  }, [planId]);

  if (loading) {
    return (
      <ThemedView className="flex-1 justify-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView className="flex-1 justify-center items-center">
        <ThemedText className="text-center text-lg font-medium opacity-60 mb-4">
          Error loading plan details
        </ThemedText>
        <ThemedText className="text-center text-sm opacity-50">
          {error.message}
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView className="flex-1">
      <View className="m-4 flex-1">
        <ThemedText className="text-2xl font-medium mb-2">
          {planDetails?.name || planName || "Workout Plan"}
        </ThemedText>
        <ThemedText className="text-sm opacity-60 mb-4">
          {workouts?.length || 0} workouts in this plan
        </ThemedText>

        {workouts && workouts.length > 0 ? (
          <ScrollView
            showsVerticalScrollIndicator={false}
            alwaysBounceVertical={true}
            className="flex-1"
          >
            {workouts.map((workout: any) => (
              <WorkoutCard
                key={workout.id}
                workout={workout.name}
                reps={workout.reps || workout.sets}
              />
            ))}
          </ScrollView>
        ) : (
          <View className="flex-1 justify-center items-center">
            <ThemedText className="text-center text-lg font-medium opacity-60 mb-4">
              No Workouts Found...
            </ThemedText>
            <ThemedText className="text-center text-sm opacity-50">
              This plan doesn't have any workouts yet.
            </ThemedText>
          </View>
        )}
      </View>

      <View className="p-4">
        <Button
          buttonText="Add Workout"
          onPress={() => {
            // TODO: Navigate to add workout screen
            console.log("Add workout to plan:", planId);
          }}
        />
      </View>
    </ThemedView>
  );
}
