import { Image, Text, View } from "react-native";
import { ThemedText } from "../ThemedText";

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
  console.log(workout_image);
  return (
    <View
      className="flex-row items-stretch rounded-2xl bg-important shadow-md overflow-hidden my-3"
      style={{ minHeight: 96 }}
    >
      <Image
        source={{
          uri: workout_image,
        }}
        style={{
          width: 160,
          height: 100,
          borderTopLeftRadius: 16,
          borderBottomLeftRadius: 16,
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
        }}
        resizeMode="cover"
      />
      <View className="flex-1 flex-col justify-center px-4 ">
        <ThemedText className="text-lg font-medium mb-1 text-black/90">
          {workout}
        </ThemedText>
        <View className="flex-row items-center mb-1"></View>

        <View className="flex-row gap-4 mt-1">
          <Text className="text-md text-mutedText font-medium">
            Reps: {reps}
          </Text>
          <Text className="text-md text-mutedText font-medium">
            Sets: {sets}
          </Text>
          <Text className="text-md text-mutedText font-medium">
            Rest: {rest_time}s
          </Text>
        </View>
      </View>
    </View>
  );
}
