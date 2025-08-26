import { Image, View } from "react-native";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";

export default function SelectedWorkoutCard({
  displayExercise,
}: {
  displayExercise: any;
}) {
  return (
    <View>
      {displayExercise ? (
        <ThemedView
          borderToken="text"
          colorToken="secondaryBackground"
          className="rounded-lg p-4 mb-4 bg-lightDark"
        >
          <View className="flex-row items-center">
            <View className="w-32 h-24 bg-important rounded-lg mr-4 overflow-hidden flex-shrink-0">
              <Image
                source={{
                  uri:
                    displayExercise.workout_id?.workout_image ||
                    "https://example.com/incline-dumbbell-press.jpg",
                }}
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>
            <View className="flex-1">
              <ThemedText className="text-whiteText text-lg font-medium">
                {displayExercise.workout_id?.workout_name ||
                  "Incline Dumbbell Press"}
              </ThemedText>
              <ThemedText className="text-mutedText text-sm mt-1">
                {displayExercise.sets} sets × {displayExercise.reps} reps
              </ThemedText>
            </View>
          </View>
        </ThemedView>
      ) : (
        <View className="border-2 border-gray-400 rounded-lg p-4 mb-4 bg-lightDark">
          <View className="flex-row items-center">
            <View className="w-24 h-24 bg-gray-600 rounded-lg mr-4 overflow-hidden flex-shrink-0 flex items-center justify-center">
              <ThemedText className="text-gray-400 text-2xl">🏋️</ThemedText>
            </View>
            <View className="flex-1">
              <ThemedText className="text-mutedText text-lg font-medium">
                No Workout Selected
              </ThemedText>
              <ThemedText className="text-veryMutedText text-sm mt-1">
                Select an exercise to begin your workout
              </ThemedText>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}
