import { Feather, Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";
import { InsightCard } from "./InsightCard";

export function Insights() {
  return (
    <View className="mx-4">
      <Text className="text-gray-400 uppercase text-xs mb-3">
        Your Insights
      </Text>

      <View className="flex-col gap-3">
        <InsightCard
          icon={<Feather name="bar-chart-2" size={28} color="#10b981" />}
          mainText="You lifted 12% more total weight this week"
          subText="Your progressive overload is working perfectly!"
        />

        <InsightCard
          icon={<Ionicons name="flash" size={28} color="#10b981" />}
          mainText="On track to hit monthly goal early"
          subText="At this pace, you'll reach 240,000 lbs by Jan 25th"
        />
      </View>
    </View>
  );
}
