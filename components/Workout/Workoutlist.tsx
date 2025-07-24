import Ionicons from "@expo/vector-icons/Ionicons";
import { ScrollView, View } from "react-native";
import { ThemedText } from "../ThemedText";
import WorkoutCard from "./WorkoutCard";

export default function Workoutlist() {
  const workoutData = [
    {
      Workout: "Lat-Pull Down",
      reps: "10-12",
    },
    {
      Workout: "Seated Rows",
      reps: "10-12",
    },
    {
      Workout: "Seated Rows",
      reps: "10-12",
    },
    {
      Workout: "Seated Rows",
      reps: "10-12",
    },
  ];

  return (
    <View className="p-4 pt-6 px-8 bg-lightDark rounded-t-[42px]  flex-1">
      <View className="relative ">
        <ThemedText className="text-lg font-medium mb-4 ">
          Today's Workout
        </ThemedText>

        <Ionicons
          className="absolute left-1/2 -translate-x-1/2"
          name="chevron-up"
          size={24}
          color="gray"
          onPress={() => {
            console.log("pressed");
          }}
        />
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        alwaysBounceVertical={true}
        className="h-[20vh]"
      >
        {workoutData.map((workout) => (
          <WorkoutCard workout={workout.Workout} reps={workout.reps} />
        ))}
      </ScrollView>
    </View>
  );
}
