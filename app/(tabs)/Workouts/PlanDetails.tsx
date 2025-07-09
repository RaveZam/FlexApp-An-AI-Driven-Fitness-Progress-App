import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
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

  useEffect(() => {
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
            className="flex-1 px-2"
          >
            {workouts.map((day: any) => (
              <View key={day.id} className="mb-8">
                <ThemedText className="text-lg font-bold mb-3 tracking-wide opacity-80">
                  {day.day_name}
                </ThemedText>
                {day.workouts_per_day && day.workouts_per_day.length > 0 ? (
                  day.workouts_per_day.map((workout: any) => (
                    <WorkoutCard
                      key={workout.id}
                      workout={workout.workout_id.workout_name}
                      reps={workout.reps}
                      sets={workout.sets}
                      rest_time={workout.rest_time}
                      muscle_group={workout.workout_id.muscle_group}
                      description={workout.workout_id.workout_description}
                      workout_image={workout.workout_id.workout_image}
                    />
                  ))
                ) : (
                  <ThemedText className="text-xs opacity-60 mb-2 ml-2">
                    No workouts for this day.
                  </ThemedText>
                )}
              </View>
            ))}
          </ScrollView>
        ) : (
          <ThemedText className="text-center mt-8 opacity-60">
            No plan days found.
          </ThemedText>
        )}
      </View>
    </ThemedView>
  );
}
