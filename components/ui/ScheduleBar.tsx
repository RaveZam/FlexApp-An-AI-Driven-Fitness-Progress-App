import { useState } from "react";
import { Dimensions, Text, View } from "react-native";
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
        return "#4B5563"; // dark gray border
      case "completed":
        return "#10B981"; // green border
      case "future":
        return "#9CA3AF"; // gray border
      default:
        return "#10B981";
    }
  };

  // const getTextColor = (day: any) => {
  //   switch (day.type) {
  //     case "rest":
  //       return "#4B5563"; // dark gray text
  //     case "completed":
  //       return "#10B981"; // green text
  //     case "future":
  //       return "#9CA3AF"; // gray text
  //     default:
  //       return "#FFFFFF";
  //   }
  // };

  return (
    <View
      style={{
        flexDirection: "row",
        padding: 16,
        paddingBottom: 20,
        justifyContent: "space-between",
        gap: 8,
      }}
      className="bg-lightDark rounded-xl mx-4 "
    >
      {days.map((day) => (
        <View className="items-center justify-center" key={day.name}>
          <ThemedView
            style={{
              marginBottom: 12,
              backgroundColor: "#1E1E1E",
            }}
          >
            <ThemedText style={{ color: "darkgray" }}>{day.name}</ThemedText>
          </ThemedView>
          <View
            style={{
              borderWidth: 2,
              width: circleSize,
              height: circleSize,
              borderColor: getBorderColor(day),
              borderRadius: circleSize / 2,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "transparent",
            }}
          >
            <Text className="text-mutedText">{day.date}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}
