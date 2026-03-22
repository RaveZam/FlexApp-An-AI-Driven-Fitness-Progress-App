import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import SearchComponent from "@/src/features/workouts/components/SearchComponent";

import useWorkouts from "@/src/features/workouts/hooks/useFetchWorkouts";
import { useWorkoutContext } from "@/src/features/workouts/hooks/useWorkoutPlanContext";
import { useAddWorkout } from "@/src/features/workouts/hooks/useAddWorkout";
import { useEffect, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { navgationHelpers } from "@/src/features/workouts/helpers/navigationHelpers";

export default function WorkoutSelector() {
  const [searchQuery, setSearchQuery] = useState("");
  const { workouts } = useWorkouts();
  const {
    getCurrentIndexDay,
    selectedWorkouts,
    initialWorkoutPlan,
    currentStepIndex,
    setSelectedWorkouts,
  } = useWorkoutContext();

  const { addWorkout } = useAddWorkout();

  useEffect(() => {
    console.log("Entering Workout Selector", initialWorkoutPlan);
  }, []);

  return (
    <SafeAreaView className="flex-1">
      <ThemedView className="flex-1">
        <SearchComponent
          setSearchQuery={setSearchQuery}
          searchQuery={searchQuery}
        />
        <ThemedText className="text-2xl text-center">
          Customize {getCurrentIndexDay(initialWorkoutPlan!, currentStepIndex)}{" "}
          Day
        </ThemedText>
        <ScrollView showsVerticalScrollIndicator={false}>
          {workouts.map((workout) => (
            <TouchableOpacity
              key={workout.id}
              className={`flex-row m-4 mx-8 rounded-2xl items-center bg-[#191818] overflow-hidden ${
                selectedWorkouts.some(
                  (selectedWorkout) => selectedWorkout.id === workout.id
                )
                  ? "border border-[#BFFA00]"
                  : ""
              }`}
              onPress={() => {
                addWorkout(
                  workout.workout_name,
                  workout.id,
                  workout.workout_image
                );
              }}
            >
              <Image
                source={{ uri: workout.workout_image }}
                style={{
                  width: 160,
                  height: 80,
                }}
                resizeMode="cover"
              />

              <View className="w-2/3 items-center">
                <ThemedText style={{ fontSize: 18 }}>
                  {workout.workout_name}
                </ThemedText>
              </View>
              <ThemedText>{workout.description}</ThemedText>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <View className="flex-row m-4 p-4 px-8 rounded-full mt-auto bg-[#202020] items-center">
          <ThemedText className="text-lg font-medium">
            Selected Workouts:
          </ThemedText>
          <Text className="text-[#BFFA00] text-lg font-bold ml-4">
            {selectedWorkouts.length}
          </Text>
          <View className="w-1/3 ml-auto">
            <TouchableOpacity
              className="bg-[#BFFA00] px-4 justify-center items-center rounded-full p-2"
              onPress={navgationHelpers.navigateToSummary}
            >
              <Text className="font-semibold">Next</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ThemedView>
    </SafeAreaView>
  );
}
