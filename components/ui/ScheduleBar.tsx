import { useState } from "react";
import { View } from "react-native";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";

export default function ScheduleBar() {
  const [days, useDays] = useState([
    {
      name: "Mon",
      isActive: false,
      date: 11,
    },
    {
      name: "Tue",
      isActive: false,
      date: 12,
    },
    {
      name: "Wed",
      isActive: false,
      date: 13,
    },
    {
      name: "Thu",
      isActive: false,
      date: 14,
    },

    {
      name: "Fri",
      isActive: false,
      date: 15,
    },
    {
      name: "Sat",
      isActive: false,
      date: 16,
    },
    {
      name: "Sun",
      isActive: false,
      date: 17,
    },
  ]);

  return (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: "#1E1E1E",
        padding: 16,
        paddingBottom: 20,
        paddingHorizontal: 20,
        justifyContent: "space-between",
        gap: 8,
        margin: 12,
        borderRadius: 24,
      }}
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
              borderColor: "#BFFA00",
              borderWidth: 2,
            }}
            className="rounded-full items-center justify-center w-12 h-12 "
          >
            <ThemedText>{day.date}</ThemedText>
          </View>
        </View>
      ))}
    </View>
  );
}
