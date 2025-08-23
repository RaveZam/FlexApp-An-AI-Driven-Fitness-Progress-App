import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import Feather from "@expo/vector-icons/Feather";
import React from "react";
import { Dimensions, View } from "react-native";
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryTheme,
} from "victory-native";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

export default function HomePageChartGraph() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "dark"];
  const screenWidth = Dimensions.get("window").width;

  const weekData = [
    { week: "W1", value: 180, isCurrentMax: false },
    { week: "W2", value: 195, isCurrentMax: false },
    { week: "W3", value: 195, isCurrentMax: false },
    { week: "W4", value: 170, isCurrentMax: false },
    { week: "W5", value: 200, isCurrentMax: false },
    { week: "W6", value: 210, isCurrentMax: false },
    { week: "W7", value: 225, isCurrentMax: false },
    { week: "W8", value: 230, isCurrentMax: true },
  ];

  // Filter out weeks with no data for Victory
  const chartData = weekData
    .filter((week) => week.value > 0)
    .map((week) => ({
      x: week.week,
      y: week.value,
      isCurrentMax: week.isCurrentMax,
    }));

  return (
    <ThemedView
      className="m-4 p-4 rounded-xl"
      colorToken="secondaryBackground"
      borderToken="border"
      borderWidth={1}
    >
      <ThemedView className="flex-row justify-between items-center">
        <ThemedText colorToken="text">Bench Press Progress</ThemedText>
        <View className="flex-row items-center gap-2">
          <ThemedText colorToken="mutedText">Last 8 weeks</ThemedText>
          <Feather name="chevron-down" size={16} color={colors.mutedText} />
        </View>
      </ThemedView>

      {/* Chart Area */}
      <ThemedView colorToken="secondaryBackground" className="rounded-lg -mt-2">
        <VictoryChart
          // domainPadding={{ x: 12 }}
          width={screenWidth - 40}
          height={180}
          theme={VictoryTheme.material}
          padding={{ top: 10, bottom: 40, left: 60, right: 60 }}
          style={{
            background: {
              fill: colorScheme === "dark" ? "#000000" : "#F3F4F6",
            },
          }}
        >
          <VictoryAxis
            dependentAxis
            tickFormat={(t) => `${t} lbs`}
            style={{
              axis: { stroke: colors.mutedText },
              tickLabels: { fill: colors.mutedText, fontSize: 12 },
            }}
          />
          <VictoryAxis
            style={{
              axis: { stroke: colors.mutedText },
              tickLabels: { fill: colors.mutedText, fontSize: 12 },
            }}
          />
          <VictoryBar
            data={chartData}
            style={{
              data: {
                fill: ({ datum }) =>
                  datum.isCurrentMax
                    ? colorScheme === "dark"
                      ? "#d1d5db"
                      : "#374151"
                    : colorScheme === "dark"
                    ? "#6b7280"
                    : "#9ca3af",
                stroke: colors.text,
              },
            }}
            cornerRadius={4}
            barWidth={20}
          />
        </VictoryChart>
      </ThemedView>

      <View className="items-center">
        <ThemedText colorToken="text">225 lbs Current Max</ThemedText>
      </View>
    </ThemedView>
  );
}
