import { Ionicons } from "@expo/vector-icons";
import Feather from "@expo/vector-icons/Feather";
import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import MyChart from "./ui/AreaChart";

export default function HomePageChartGraph() {
  const [toggled, setToggled] = useState(false);
  const collapsedHeight = 52; // Height for one line of text (adjust as needed)
  const expandedHeight = 100; // Height for full text (adjust as needed)
  const animation = useSharedValue(expandedHeight);

  const handleToggle = () => {
    setToggled((prev) => {
      const next = !prev;
      animation.value = withTiming(next ? expandedHeight : collapsedHeight, {
        duration: 300,
      });
      return next;
    });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    height: animation.value,
  }));

  // Ensure animation is correct on first render
  React.useEffect(() => {
    animation.value = toggled ? expandedHeight : collapsedHeight;
  }, []);

  return (
    <View className="m-4 bg-lightDark border p-4  rounded-xl">
      <Text className="text-lg font-medium text-whiteText font-md">
        Your Workout Progress This Month
      </Text>
      <Text className="text-md text-mutedText opacity-70">
        Based on your Activity
      </Text>

      <MyChart />
      <View className="gap-2 mt-2">
        <Pressable
          onPress={handleToggle}
          className="flex-row gap-2 hover:cursor-pointer items-center"
        >
          <View className="flex-row gap-1 items-center">
            <Feather name="bar-chart" size={20} color="white" />
            <Text className="text-md text-whiteText font-medium ">
              AI Analysis
            </Text>
          </View>
          <Ionicons
            name={toggled ? "chevron-up" : "chevron-down"}
            size={12}
            color="white"
          />
        </Pressable>
        <Animated.View
          className="p-4 bg-important rounded-lg"
          style={[{ overflow: "hidden", width: "100%" }, animatedStyle]}
        >
          <Text
            className="text-sm text-mutedText font-medium"
            numberOfLines={toggled ? undefined : 1}
            ellipsizeMode="tail"
            style={{ width: "100%" }}
          >
            Based on your recent workout logs, your lifting performance is
            progressing steadily. You've consistently increased weights on your
            compound lifts over the last 3 weeks.
          </Text>
        </Animated.View>
      </View>
    </View>
  );
}
