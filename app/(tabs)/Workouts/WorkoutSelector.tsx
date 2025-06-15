import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useWorkoutContext } from "@/hooks/useWorkoutPlanContext";
import SearchComponent from "./components/SearchComponent";
import useWorkouts from "@/hooks/useFetchWorkouts";

import { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  Touchable,
  TouchableOpacity,
} from "react-native";
import Button from "@/components/ui/Button";

export default function WorkoutSelector() {
  const { selectedDay, selectedPlan } = useWorkoutContext();
  const [searchQuery, setSearchQuery] = useState("");
  const { workouts, error } = useWorkouts();

  return (
    <ThemedView className="flex-1 ">
      <SearchComponent
        setSearchQuery={setSearchQuery}
        searchQuery={searchQuery}
      />
      <ScrollView showsVerticalScrollIndicator={false} className="m-4">
        {workouts.map((workout) => (
          <ThemedView
            key={workout.id}
            style={{
              margin: 10,
              padding: 10,
              borderWidth: 1,
              borderColor: "#ccc",
              borderRadius: 5,
            }}
          >
            <ThemedText style={{ fontSize: 18 }}>
              {workout.workout_name}
            </ThemedText>
            <ThemedText>{workout.description}</ThemedText>
          </ThemedView>
        ))}
      </ScrollView>
      <View className="flex-row m-4 p-4 px-8 rounded-full mt-auto bg-[#202020] items-center ">
        <ThemedText className="text-lg font-medium">
          Selected Workouts:
        </ThemedText>
        <Text className="text-[#BFFA00] text-lg font-bold ml-4">2</Text>
        <View className="w-1/3 ml-auto">
          <TouchableOpacity className="bg-[#BFFA00] px-4  justify-center items-center rounded-full p-2">
            <Text className="font-semibold">Next</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ThemedView>
  );
}
