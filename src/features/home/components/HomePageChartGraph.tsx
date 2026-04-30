import Feather from "@expo/vector-icons/Feather";
import React from "react";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryTheme,
} from "victory-native";

export function HomePageChartGraph() {
  const screenWidth = Dimensions.get("window").width;

  const weekData = [
    { week: "W1", value: 180, isCurrentMax: false },
    { week: "W2", value: 195, isCurrentMax: false },
    { week: "W3", value: 195, isCurrentMax: false },
    { week: "W4", value: 170, isCurrentMax: false },
    { week: "W5", value: 200, isCurrentMax: false },
    { week: "W6", value: 210, isCurrentMax: false },
    { week: "W7", value: 235, isCurrentMax: true },
    { week: "W8", value: 230, isCurrentMax: false },
  ];

  const chartData = weekData
    .filter((week) => week.value > 0)
    .map((week) => ({
      x: week.week,
      y: week.value,
      isCurrentMax: week.isCurrentMax,
    }));

  return (
    <Animated.View
      entering={FadeInDown.delay(250).springify().damping(18)}
      style={{
        marginHorizontal: 16,
        borderRadius: 16,
        backgroundColor: "#191919",
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.04)",
      }}
    >
      {/* Top accent strip */}
      <View
        style={{
          height: 3,
          backgroundColor: "#10b981",
          opacity: 0.6,
        }}
      />

      <View style={{ padding: 16 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: "#ffffff",
              fontSize: 15,
              fontFamily: "Inter_600SemiBold",
            }}
          >
            Bench Press Progress
          </Text>
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
              backgroundColor: "rgba(255,255,255,0.04)",
              paddingHorizontal: 10,
              paddingVertical: 5,
              borderRadius: 8,
            }}
          >
            <Text
              style={{
                color: "#666",
                fontSize: 12,
                fontFamily: "Inter_400Regular",
              }}
            >
              8 weeks
            </Text>
            <Feather name="chevron-down" size={12} color="#666" />
          </TouchableOpacity>
        </View>

        <View style={{ marginTop: -4 }}>
          <VictoryChart
            width={screenWidth - 72}
            height={150}
            theme={VictoryTheme.material}
            padding={{ top: 10, bottom: 40, left: 55, right: 20 }}
            style={{
              background: { fill: "transparent" },
            }}
          >
            <VictoryAxis
              dependentAxis
              tickFormat={(t: number) => `${t}`}
              style={{
                axis: { stroke: "transparent" },
                tickLabels: {
                  fill: "#444",
                  fontSize: 10,
                  fontFamily: "Inter_400Regular",
                },
                grid: { stroke: "rgba(255,255,255,0.03)" },
              }}
            />
            <VictoryAxis
              style={{
                axis: { stroke: "rgba(255,255,255,0.04)" },
                tickLabels: {
                  fill: "#555",
                  fontSize: 10,
                  fontFamily: "Inter_400Regular",
                },
              }}
            />
            <VictoryBar
              data={chartData}
              style={{
                data: {
                  fill: ({ datum }: any) =>
                    datum.isCurrentMax ? "#10b981" : "#1a472a",
                  stroke: "transparent",
                },
              }}
              cornerRadius={4}
              barWidth={18}
            />
          </VictoryChart>
        </View>

        {/* Current max indicator */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          <View
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: "#10b981",
            }}
          />
          <Text
            style={{
              color: "#888",
              fontSize: 13,
              fontFamily: "Inter_400Regular",
            }}
          >
            225 lbs
          </Text>
          <Text
            style={{
              color: "#10b981",
              fontSize: 13,
              fontFamily: "Inter_600SemiBold",
            }}
          >
            Current Max
          </Text>
        </View>
      </View>
    </Animated.View>
  );
}
