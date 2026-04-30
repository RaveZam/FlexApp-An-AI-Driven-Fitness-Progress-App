import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Dimensions, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

export default function ScheduleBar() {
  const [days] = useState([
    { name: "Sun", date: 17, type: "rest" },
    { name: "Mon", date: 11, type: "completed" },
    { name: "Tue", date: 12, type: "completed" },
    { name: "Wed", date: 13, type: "rest" },
    { name: "Thu", date: 14, type: "future" },
    { name: "Fri", date: 15, type: "future" },
    { name: "Sat", date: 16, type: "rest" },
  ]);

  const screenWidth = Dimensions.get("window").width;
  const circleSize = (screenWidth - 48 - 6 * 10) / 7;

  const getDayStyle = (day: any) => {
    switch (day.type) {
      case "rest":
        return {
          bg: "#191919",
          border: "rgba(255,255,255,0.04)",
          text: "#555",
          nameFill: "#444",
        };
      case "completed":
        return {
          bg: "#10b981",
          border: "#10b981",
          text: "#ffffff",
          nameFill: "#10b981",
        };
      case "future":
        return {
          bg: "transparent",
          border: "rgba(16, 185, 129, 0.2)",
          text: "#888",
          nameFill: "#666",
        };
      default:
        return {
          bg: "#191919",
          border: "rgba(255,255,255,0.04)",
          text: "#555",
          nameFill: "#444",
        };
    }
  };

  return (
    <Animated.View
      entering={FadeInDown.delay(100).duration(400)}
      style={{
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 8,
        backgroundColor: "#0f0f0f",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 14,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <View
            style={{
              width: 4,
              height: 18,
              borderRadius: 2,
              backgroundColor: "#f59e0b",
            }}
          />
          <Text
            style={{
              color: "#ffffff",
              fontSize: 16,
              fontFamily: "Inter_600SemiBold",
              letterSpacing: 0.3,
            }}
          >
            This Week
          </Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
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
              color: "#555",
              fontSize: 11,
              fontFamily: "Inter_400Regular",
            }}
          >
            2 of 4 done
          </Text>
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          gap: 6,
          paddingBottom: 8,
        }}
      >
        {days.map((day, index) => {
          const style = getDayStyle(day);
          return (
            <Animated.View
              key={day.name}
              entering={FadeInDown.delay(140 + index * 40)
                .springify()
                .damping(20)}
              style={{ alignItems: "center", justifyContent: "center" }}
            >
              <Text
                style={{
                  color: style.nameFill,
                  fontSize: 11,
                  fontFamily: "Inter_500Medium",
                  marginBottom: 8,
                }}
              >
                {day.name}
              </Text>
              <View
                style={{
                  width: circleSize,
                  height: circleSize,
                  borderRadius: circleSize / 2,
                  borderWidth: 1.5,
                  borderColor: style.border,
                  backgroundColor: style.bg,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {day.type === "completed" ? (
                  <Ionicons name="checkmark" size={16} color="#ffffff" />
                ) : (
                  <Text
                    style={{
                      color: style.text,
                      fontSize: 13,
                      fontFamily: "Inter_600SemiBold",
                    }}
                  >
                    {day.date}
                  </Text>
                )}
              </View>
            </Animated.View>
          );
        })}
      </View>
    </Animated.View>
  );
}
