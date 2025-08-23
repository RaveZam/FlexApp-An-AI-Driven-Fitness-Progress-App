import { Colors } from "@/constants";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import { InsightCard } from "./InsightCard";

export function Insights() {
  return (
    <ThemedView colorToken="secondaryBackground" className="mx-4 rounded-lg">
      <ThemedText type="title" style={{ fontSize: 20 }}>
        Your Insights
      </ThemedText>

      <ThemedView className="flex-col gap-4 mt-4">
        <InsightCard
          icon={
            <Feather name="trending-up" size={24} color={Colors.light.text} />
          }
          mainText="You lifted 12% more total weight this week"
          subText="Your progressive overload is working perfectly!"
        />

        <InsightCard
          icon={<Feather name="target" size={24} color={Colors.light.text} />}
          mainText="On track to hit monthly goal early"
          subText="At this pace, you'll reach 240,000 lbs by Jan 25th"
        />
      </ThemedView>
    </ThemedView>
  );
}
