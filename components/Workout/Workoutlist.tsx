import { useFetchWorkoutPlans } from "@/hooks/useFetchWorkoutPlans";
import { useGetCurrentWorkoutToday } from "@/hooks/useGetCurrentWorkoutToday";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { ThemedText } from "../ThemedText";
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

  const height = useSharedValue(200);

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
    height.value = withTiming(collapsed ? 200 : 500, {
      duration: 300,
    });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    height: height.value,
  }));

  return (
    <>
      <Animated.View
        style={[styles.container, animatedStyle]}
        className="w-full bottom-0 rounded-t-[42px] z-50 bg-lightDark px-8 pt-6 flex-1"
      >
        <View className="relative">
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
        </View>

        {loading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#10b981" />
          </View>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            className="h-full"
            contentContainerStyle={{ paddingBottom: 40 }}
          >
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

const styles = StyleSheet.create({
  container: {
    width: "100%",
    bottom: 0,
    position: "absolute",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.8,
    shadowRadius: 24,
  },
});
