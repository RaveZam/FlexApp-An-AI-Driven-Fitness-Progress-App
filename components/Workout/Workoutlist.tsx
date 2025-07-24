import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { ThemedText } from "../ThemedText";
import WorkoutCard from "./WorkoutCard";

export default function Workoutlist({ className }: { className: string }) {
  const [collapsed, setCollapsed] = useState(false);
  const height = useSharedValue(300);

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
    height.value = withTiming(collapsed ? 300 : 500, {
      duration: 300,
    });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    height: height.value,
  }));

  const workoutData = [
    { Workout: "Lat-Pull Down", reps: "10-12" },
    { Workout: "Seated Rows", reps: "10-12" },
    { Workout: "Seated Rows", reps: "10-12" },
    { Workout: "Seated Rows", reps: "10-12" },
  ];

  return (
    <Animated.View
      style={[styles.container, animatedStyle]}
      className={`w-full bottom-0 rounded-t-[42px] bg-lightDark px-8 pt-6 flex-1 ${className}`}
    >
      <View className="relative">
        <ThemedText className="text-lg font-medium mb-4">
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

      <ScrollView
        showsVerticalScrollIndicator={false}
        className="h-full"
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {workoutData.map((workout, index) => (
          <WorkoutCard
            key={index}
            workout={workout.Workout}
            reps={workout.reps}
          />
        ))}
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    bottom: 0,
  },
});
