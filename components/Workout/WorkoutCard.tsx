import { Image, View } from "react-native";
import { ThemedText } from "../ThemedText";

export default function WorkoutCard({
  workout,
  reps,
  sets,
  rest_time,
  muscle_group,
  description,
  workout_image,
}: {
  workout: string;
  reps: string;
  sets: string;
  rest_time: string;
  muscle_group: string;
  description: string;
  workout_image?: string;
}) {
  return (
    <View className="flex-row items-center rounded-2xl bg-[#18181b] shadow-sm overflow-hidden my-3 p-3">
      <Image
        source={
          workout_image
            ? { uri: workout_image }
            : require("../../assets/images/WorkoutImages/latpulldownimage.webp")
        }
        style={{
          width: 72,
          height: 72,
          borderRadius: 16,
          backgroundColor: "#232323",
          marginRight: 16,
        }}
        resizeMode="cover"
      />
      <View className="flex-1 justify-center">
        <ThemedText className="text-md mb-1 opacity-90">{workout}</ThemedText>
        <ThemedText className="text-xs opacity-60 mb-1">
          {muscle_group}
        </ThemedText>
        <ThemedText className="text-xs opacity-50 mb-1">
          {description}
        </ThemedText>
        <View className="flex-row gap-3 mt-1">
          <ThemedText className="text-xs opacity-70">Reps: {reps}</ThemedText>
          <ThemedText className="text-xs opacity-70">Sets: {sets}</ThemedText>
          <ThemedText className="text-xs opacity-70">
            Rest: {rest_time}s
          </ThemedText>
        </View>
      </View>
    </View>
  );
}
