import { Image, Text, View } from "react-native";

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
    <View
      className="flex-row  rounded-md bg-lightDark border-important border shadow-md overflow-hidden my-3"
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
      <View className="flex-1 flex-col items-center  justify-center p-4 ">
        <Text className="text-[1rem]  mb-1 text-white">
          {truncate(workout)}
        </Text>
        <View className="flex-row items-center mb-1"></View>

        <View className="flex-row gap-4">
          <View className="flex-col items-center">
            <Text className="text-sm text-veryMutedText font-medium">
              Reps:
            </Text>
            <Text className="text-md text-mutedText font-medium">{reps}</Text>
          </View>

          <View className="flex-col items-center">
            <Text className="text-sm text-veryMutedText  font-medium">
              Sets:
            </Text>
            <Text className="text-md text-mutedText font-medium">{sets}</Text>
          </View>
          <View className="flex-col items-center">
            <Text className="text-sm text-veryMutedText font-medium">
              Rest:
            </Text>
            <Text className="text-md text-mutedText font-medium">
              {rest_time}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
