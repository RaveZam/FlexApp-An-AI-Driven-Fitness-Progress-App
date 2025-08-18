import { useState } from "react";
import { Dimensions, View } from "react-native";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";

export default function ScheduleBar() {
  const [days, useDays] = useState([
    {
      name: "Sun",
      isActive: false,
      date: 17,
      type: "rest", // rest day
    },
    {
      name: "Mon",
      isActive: false,
      date: 11,
      type: "completed", // completed workout
    },
    {
      name: "Tue",
      isActive: false,
      date: 12,
      type: "completed", // completed workout
    },
    {
      name: "Wed",
      isActive: false,
      date: 13,
      type: "rest", // rest day
    },
    {
      name: "Thu",
      isActive: false,
      date: 14,
      type: "future", // future workout
    },
    {
      name: "Fri",
      isActive: false,
      date: 15,
      type: "future", // future workout
    },
    {
      name: "Sat",
      isActive: false,
      date: 16,
      type: "rest", // rest day
    },
  ]);

  const screenWidth = Dimensions.get("window").width;
  const circleSize = (screenWidth - 40 - 6 * 12) / 7; // 40 is padding, 6*8 is 6 gaps of 8px

  const getBorderColor = (day: any) => {
    switch (day.type) {
      case "rest":
        return {
          highlight: "#D1D5DB",
          text: "#828894",
        };
      case "completed":
        return {
          highlight: "#1F2937",
          text: "#ffffff",
        };
      case "future":
        return {
          highlight: "#4B5563",
          text: "#F9FAFB",
        };

      default:
        return {
          highlight: "#4B5563",
          text: "muted",
        };
    }
  };

  return (
    <ThemedView
      colorToken="secondaryBackground"
      style={{ padding: 16, paddingBottom: 0 }}
    >
      <ThemedText className="mb-3 opacity-70" colorToken="text">
        This Week
      </ThemedText>

      <ThemedView
        colorToken="secondaryBackground"
        style={{
          flexDirection: "row",
          paddingBottom: 20,
          justifyContent: "space-between",
          gap: 8,
        }}
      >
        {days.map((day) => (
          <View className="items-center justify-center" key={day.name}>
            <ThemedView
              style={{
                marginBottom: 12,
              }}
            >
              <ThemedText colorToken="mutedText">{day.name}</ThemedText>
            </ThemedView>
            <ThemedView
              style={{
                borderWidth: 2,
                width: circleSize,
                height: circleSize,
                borderColor: getBorderColor(day).highlight,
                borderRadius: circleSize / 2,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: getBorderColor(day).highlight,
              }}
            >
              <ThemedText style={{ color: getBorderColor(day).text }}>
                {day.date}
              </ThemedText>
            </ThemedView>
          </View>
        ))}
      </ThemedView>
    </ThemedView>
  );
}
