import Ionicons from "@expo/vector-icons/Ionicons";
import { ScrollView, StyleSheet, View } from "react-native";
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

  const workoutData = [
    { Workout: "Lat-Pull Down", reps: "10-12" },
    { Workout: "Seated Rows", reps: "10-12" },
    { Workout: "Seated Rows", reps: "10-12" },
    { Workout: "Seated Rows", reps: "10-12" },
  ];

  return (
    <>
      <Animated.View
        style={[styles.container, animatedStyle]}
        className="w-full bottom-0 rounded-t-[42px] z-50 bg-lightDark px-8 pt-6 flex-1"
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
