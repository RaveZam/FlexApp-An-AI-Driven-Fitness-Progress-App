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
    <View className="m-4">
      <ThemedText className="text-lg font-medium mb-4">
        Today's Workout
      </ThemedText>
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
