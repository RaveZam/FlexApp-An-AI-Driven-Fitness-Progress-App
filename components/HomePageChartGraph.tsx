import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import Feather from "@expo/vector-icons/Feather";
import React from "react";
import { View } from "react-native";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

export default function HomePageChartGraph() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "dark"];

  // Sample data for the 8 weeks
  const weekData = [
    { week: "W1", value: 180, hasData: true, isCurrentMax: false },
    { week: "W2", value: 195, hasData: true, isCurrentMax: false },
    { week: "W3", value: 0, hasData: false, isCurrentMax: false },
    { week: "W4", value: 0, hasData: false, isCurrentMax: false },
    { week: "W5", value: 200, hasData: true, isCurrentMax: false },
    { week: "W6", value: 0, hasData: false, isCurrentMax: false },
    { week: "W7", value: 225, hasData: true, isCurrentMax: true },
    { week: "W8", value: 0, hasData: false, isCurrentMax: false },
  ];

  const maxValue = Math.max(...weekData.map((w) => w.value));

  return (
    <ThemedView
      className="m-4  p-4 rounded-xl"
      colorToken="secondaryBackground"
      borderToken="border"
      borderWidth={1}
    >
      {/* Header */}
      <ThemedView className="flex-row justify-between items-center mb-4">
        <ThemedText colorToken="text">Bench Press Progress</ThemedText>
        <View className="flex-row items-center gap-2">
          <ThemedText colorToken="mutedText">Last 8 weeks</ThemedText>
          <Feather name="chevron-down" size={16} color={colors.mutedText} />
        </View>
      </ThemedView>

      {/* Chart Area */}
      <ThemedView
        colorToken="secondaryBackground"
        className="rounded-lg p-4 mb-4"
      >
        <ThemedView className="flex-row items-end justify-between h-32">
          {weekData.map((week, index) => (
            <ThemedView key={index} className="flex-1 items-center">
              {/* Bar */}
              {week.hasData && (
                <View
                  className="w-8 mb-2"
                  style={{
                    height:
                      week.value > 0
                        ? Math.max((week.value / maxValue) * 80, 16)
                        : 0,
                    backgroundColor: week.isCurrentMax
                      ? colorScheme === "dark"
                        ? "#d1d5db"
                        : "#374151"
                      : colorScheme === "dark"
                      ? "#6b7280"
                      : "#9ca3af",
                    borderRadius: 4,
                  }}
                />
              )}
              {/* Week Label */}
              <ThemedText
                type="muted"
                colorToken="mutedText"
                style={{ fontSize: 12 }}
              >
                {week.week}
              </ThemedText>
            </ThemedView>
          ))}
        </ThemedView>
      </ThemedView>

      {/* Footer */}
      <View className="items-center">
        <ThemedText type="defaultSemiBold" colorToken="text">
          225 lbs Current Max
        </ThemedText>
      </View>
    </ThemedView>
  );
}
