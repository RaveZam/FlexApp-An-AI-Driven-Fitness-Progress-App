import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import Button from "@/components/ui/Button";
import Popup from "@/components/ui/Popup";
import WorkoutCard from "@/components/Workout/WorkoutCard";
import { useFetchPlanDetails } from "@/hooks/useFetchPlanDetails";
import { useGetCurrentWorkoutToday } from "@/hooks/useGetCurrentWorkoutToday";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";

export default function PlanDetails() {
  const router = useRouter();
  const { planId, planName } = useLocalSearchParams<{
    planId: string;
    planName: string;
  }>();

  const {
    planDetails,
    workouts,
    loading,
    error,
    fetchPlanAndWorkouts,
    selectActiveWorkout,
  } = useFetchPlanDetails();

  const [showPopup, setShowPopup] = useState<boolean>(false);
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
          {workouts
            ? workouts.reduce(
                (total: number, day: any) =>
                  total + (day.workouts_per_day?.length || 0),
                0
              )
            : 0}{" "}
          workouts in this plan
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
                      workout_image={workout.workout_id.workout_image}
                      reps={workout.reps}
                      sets={workout.sets}
                      rest_time={workout.rest_time}
                    />
                  ))
                ) : (
                  <ThemedText className="text-xs opacity-60 mb-2 ml-2">
                    No workouts for this day.
                  </ThemedText>
                )}
              </View>
            ))}
            <Button
              className=""
              buttonText="Set Active Workout"
              onPress={() => {
                selectActiveWorkout(Number(planId)).then((status) => {
                  if (status === 200) {
                    console.log("triggered Fetch Workout");
                    setShowPopup(true);
                    fetchPlanAndWorkouts(planId);
                  }
                });
              }}
            />
            <Popup
              isVisible={showPopup}
              onClose={() => {}}
              iconName="checkcircle"
              iconColor="#FFFFFF"
              message="Workout plan activated successfully!"
              buttons={[
                {
                  text: "OK",
                  onPress: () => {
                    setShowPopup(false);
                    router.push("/Workouts");
                  },
                },
              ]}
            />
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
