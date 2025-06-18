import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useWorkoutContext } from "@/hooks/useWorkoutPlanContext";
import SearchComponent from "./components/SearchComponent";

import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function WorkoutSelector() {
  const [searchQuery, setSearchQuery] = useState("");
  const { selectedWorkouts, currentStep, initialWorkoutPlan, nextStep } =
    useWorkoutContext();

  console.log(initialWorkoutPlan);

  return (
    <ThemedView className="flex-1">
      <SearchComponent
        setSearchQuery={setSearchQuery}
        searchQuery={searchQuery}
      />
      <ThemedText className="text-2xl text-center">
        Customize {currentStep.day} Day
      </ThemedText>
      {/* <ScrollView showsVerticalScrollIndicator={false}>
        {workouts.map((workout) => (
          <TouchableOpacity
            key={workout.id}
            className={`flex-row m-4 mx-8 rounded-2xl items-center bg-[#191818] overflow-hidden cursor-pointer ${
              selectedWorkouts.some(
                (selectedWorkout) => selectedWorkout.id === workout.id
              )
                ? "border-2  border-[#BFFA00] opacity-80 duration-300"
                : ""
            }`}
            onPress={() => {}}
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
      </ScrollView> */}
      <View className="flex-row m-4 p-4 px-8 rounded-full mt-auto bg-[#202020] items-center ">
        <ThemedText className="text-lg font-medium">
          Selected Workouts:
        </ThemedText>
        <Text className="text-[#BFFA00] text-lg font-bold ml-4">
          {selectedWorkouts.length}
        </Text>
        <View className="w-1/3 ml-auto">
          <TouchableOpacity className="bg-[#BFFA00] px-4  justify-center items-center rounded-full p-2">
            <Text
              onPress={() => {
                nextStep();
                // router.push("/Workouts/Summary");
              }}
              className="font-semibold"
            >
              Next
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ThemedView>
  );
}
