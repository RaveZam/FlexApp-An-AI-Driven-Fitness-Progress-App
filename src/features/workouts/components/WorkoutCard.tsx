import { Image } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

export default function WorkoutCard({
  workout,
  reps,
  sets,
  rest_time,
  workout_image,
}: {
  workout: string;
  reps: string;
  sets: string;
  rest_time: string;
  workout_image: string;
}) {
  return (
    <ThemedView
      borderToken="border"
      className="flex-row rounded-md my-2 shadow-sm overflow-hidden "
    >
      <Image
        source={{
          uri: workout_image,
        }}
        style={{
          width: 160,
          height: 80,
        }}
        resizeMode="cover"
      />
      <ThemedView className="flex-1 flex-col justify-center ml-4 ">
        <ThemedText type="cardTitle">{workout}</ThemedText>
        <ThemedView className="flex-row gap-2  mb-1">
          <ThemedText type="subtitle" colorToken="mutedText">
            {reps} reps × {sets} sets
          </ThemedText>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
}
