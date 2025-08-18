import { Image, Text } from "react-native";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";

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
  const truncate = (text: string, max = 20) =>
    text.length > max ? `${text.slice(0, max)}...` : text;
  return (
    <ThemedView
      borderToken="border"
      className="flex-row rounded-md shadow-md overflow-hidden my-3"
      style={{ minHeight: 96 }}
    >
      <Image
        source={{
          uri: workout_image,
        }}
        style={{
          width: 160,
          height: 100,
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
        }}
        resizeMode="cover"
      />
      <ThemedView className="flex-1 flex-col items-center  justify-center p-4 ">
        <ThemedText type="cardTitle" className="  mb-1">
          {truncate(workout)}
        </ThemedText>
        <ThemedView className="flex-row items-center mb-1"></ThemedView>

        <ThemedView className="flex-row gap-4">
          <ThemedView className="flex-col items-center">
            <ThemedText className="text-sm text-veryMutedText font-medium">
              Reps:
            </ThemedText>
            <ThemedText className="text-md text-mutedText font-medium">
              {reps}
            </ThemedText>
          </ThemedView>

          <ThemedView className="flex-col items-center">
            <ThemedText className="text-sm text-veryMutedText  font-medium">
              Sets:
            </ThemedText>
            <ThemedText className="text-md text-mutedText font-medium">
              {sets}
            </ThemedText>
          </ThemedView>
          <ThemedView className="flex-col items-center">
            <ThemedText className="text-sm text-veryMutedText font-medium">
              Rest:
            </ThemedText>
            <Text className="text-md text-mutedText font-medium">
              {rest_time}
            </Text>
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
}
