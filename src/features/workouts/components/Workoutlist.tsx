import { Colors } from "@/constants/Colors";
import { useFetchWorkoutPlans } from "@/src/features/workouts/hooks/useFetchWorkoutPlans";
import { useGetCurrentWorkoutToday } from "@/src/features/workouts/hooks/useGetCurrentWorkoutToday";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  useColorScheme,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import WorkoutCard from "./WorkoutCard";

export default function Workoutlist({
  collapsed,
  setCollapsed,
}: {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}) {
  const { loading, currentWorkout } = useGetCurrentWorkoutToday();
  useFetchWorkoutPlans();
  const colorScheme = useColorScheme();

  const height = useSharedValue(160);

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
    height.value = withTiming(collapsed ? 160 : 500, {
      duration: 200,
    });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    height: height.value,
  }));

  return (
    <>
      <Animated.View
        style={[
          animatedStyle,
          { backgroundColor: Colors.light.secondaryBackground },
        ]}
        className={`p-4 px-8  border-t border-gray-300
         `}
      >
        <ThemedView className="relative">
          <ThemedText className="text-lg text-whiteText font-medium mb-4">
            Today's Workout
          </ThemedText>

          <Ionicons
            className="absolute left-1/2 -translate-x-1/2"
            name={collapsed ? "chevron-down" : "chevron-up"}
            size={24}
            color="gray"
            onPress={toggleCollapse}
          />
        </ThemedView>

        {loading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#10b981" />
          </View>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}>
            {currentWorkout?.workouts_per_day === undefined ? (
              <View className=" justify-center mt-12 items-center">
                <Text className="text-veryMutedText text-[1.1rem]">
                  {" "}
                  No Workout Today
                </Text>
              </View>
            ) : (
              currentWorkout.workouts_per_day.map(
                (workout: any, index: number) => (
                  <WorkoutCard
                    key={index}
                    workout={workout.workout_id.workout_name}
                    reps={workout.reps}
                    sets={workout.sets}
                    rest_time={workout.rest_time}
                    workout_image={workout.workout_id.workout_image}
                  />
                )
              )
            )}
          </ScrollView>
        )}
      </Animated.View>
    </>
  );
}
