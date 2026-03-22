import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import Button from "@/components/ui/Button";
import Popup from "@/components/ui/Popup";
import WorkoutCard from "@/src/features/workouts/components/WorkoutCard";
import { useFetchPlanDetails } from "@/src/features/workouts/hooks/useFetchPlanDetails";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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
      <SafeAreaView className="flex-1">
        <ThemedView className="flex-1 justify-center">
          <ActivityIndicator size="large" color="#0000ff" />
        </ThemedView>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1">
        <ThemedView className="flex-1 justify-center items-center">
          <ThemedText className="text-center text-lg font-medium opacity-60 mb-4">
            Error loading plan details
          </ThemedText>
          <ThemedText className="text-center text-sm opacity-50">
            {error.message}
          </ThemedText>
        </ThemedView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1">
      <ThemedView colorToken="secondaryBackground" className="flex-1">
        <View className="m-4 flex-1">
          <View className="flex-row items-center justify-between mb-2 py-4  px-1">
            <TouchableOpacity onPress={() => router.back()}>
              <MaterialIcons name="arrow-back" size={22} color="#555" />
            </TouchableOpacity>
            <ThemedText className="text-base font-medium">
              Workout Plan
            </ThemedText>
            <TouchableOpacity>
              <MaterialIcons name="more-vert" size={20} color="#555" />
            </TouchableOpacity>
          </View>
          <ThemedView className="rounded-md border-black px-4 py-4 mb-4 items-center">
            <ThemedText type="title" className=" mb-2">
              {planDetails?.name || planName || "Workout Plan"} Workout
            </ThemedText>
            <View className="flex-row items-center mb-2">
              <View className="flex-row items-center">
                <MaterialIcons name="calendar-today" size={14} color="#999" />
                <ThemedText className="text-xs opacity-70 ml-1">
                  {(workouts && workouts.length) || 0} Days
                </ThemedText>
              </View>
              <ThemedText className="mx-2 opacity-30">•</ThemedText>
              <View className="flex-row items-center">
                <MaterialIcons name="fitness-center" size={14} color="#999" />
                <ThemedText className="text-xs opacity-70 ml-1">
                  {workouts
                    ? workouts.reduce(
                        (total: number, day: any) =>
                          total + (day.workouts_per_day?.length || 0),
                        0
                      )
                    : 0}{" "}
                  Workouts
                </ThemedText>
              </View>
              <ThemedText className="mx-2 opacity-30">•</ThemedText>
              <View className="flex-row items-center">
                <MaterialIcons name="schedule" size={14} color="#999" />
                <ThemedText className="text-xs opacity-70 ml-1">
                  45-60 min
                </ThemedText>
              </View>
            </View>
            <ThemedText className="text-xs opacity-60 text-center">
              Complete strength training program for muscle growth
            </ThemedText>
          </ThemedView>

          {workouts && workouts.length > 0 ? (
            <ScrollView
              showsVerticalScrollIndicator={false}
              className="flex-1 px-2"
            >
              {workouts.map((day: any, index: number) => {
                const exerciseCount = day.workouts_per_day?.length || 0;
                const muscleGroups: string = Array.from(
                  new Set(
                    (day.workouts_per_day || [])
                      .map((w: any) => w?.workout_id?.muscle_group)
                      .filter(Boolean)
                  )
                ).join(", ");

                return (
                  <ThemedView
                    key={day.id || `${index}`}
                    className="mb-3 rounded-md pb-4"
                  >
                    <View className="flex-row items-center justify-between px-3 pt-3 ">
                      <View className="flex-1 pr-2 ">
                        <ThemedText className="text-base font-medium">
                          Day {index + 1} - {day.day_name}
                        </ThemedText>
                        <ThemedText className="text-xs opacity-60 mt-0.5">
                          {day.day}
                          {muscleGroups ? ` • ${muscleGroups}` : ""}
                        </ThemedText>
                      </View>
                      <View className="px-3 py-2 rounded-full bg-black/5 dark:bg-white/10">
                        <ThemedText colorToken="text" type="subtitle">
                          {exerciseCount}{" "}
                          {exerciseCount === 1 ? "Workout" : "Workouts"}
                        </ThemedText>
                      </View>
                    </View>
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
                  </ThemedView>
                );
              })}
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
    </SafeAreaView>
  );
}
