import Feather from "@expo/vector-icons/Feather";
import React, { useState } from "react";
import { Text, View } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import MyChart from "./ui/AreaChart";

export default function HomePageChartGraph() {
  const [toggled, setToggled] = useState(false);
  const collapsedHeight = 52; // Height for one line of text (adjust as needed)
  const expandedHeight = 100; // Height for full text (adjust as needed)
  const animation = useSharedValue(expandedHeight);

  return (
    <View className="m-4 bg-lightDark border p-4 rounded-xl">
      <Text className="text-lg font-medium text-whiteText font-md">
        Your Workout Progress This Month
      </Text>
      <Text className="text-md text-mutedText opacity-70">
        Based on your Activity
      </Text>

      <MyChart />
      <View className="gap-2 mt-2">
        <View className="flex-row gap-2 hover:cursor-pointer items-center">
          <View className="flex-row gap-1 items-center">
            <Feather name="bar-chart" size={20} color="white" />
            <Text className="text-md text-whiteText font-medium ">
              AI Analysis
            </Text>
          </View>
        </View>
        <View
          className="p-4 bg-important rounded-lg"
          style={{ overflow: "hidden", width: "100%" }}
        >
          <Text
            className="text-sm text-mutedText font-medium"
            ellipsizeMode="tail"
            style={{ width: "100%" }}
          >
            Based on your recent workout logs, your lifting performance is
            progressing steadily. You've consistently increased weights on your
            compound lifts over the last 3 weeks.
          </Text>
        </View>
      </View>
    </View>
  );
}
