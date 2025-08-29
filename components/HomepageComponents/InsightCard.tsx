import React from "react";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";

interface InsightCardProps {
  icon: React.ReactNode;
  mainText: string;
  subText: string;
}

export function InsightCard({ icon, mainText, subText }: InsightCardProps) {
  return (
    <ThemedView
      colorToken="secondaryBackground"
      className="flex-row gap-2 p-4 rounded-lg"
    >
      <ThemedView className="w-12 h-12 rounded-full items-center justify-center mr-4">
        {icon}
      </ThemedView>
      <ThemedView colorToken="secondaryBackground" className="flex-1">
        <ThemedText type="defaultSemiBold">{mainText}</ThemedText>
        <ThemedText colorToken="mutedText" type="subtitle">
          {subText}
        </ThemedText>
      </ThemedView>
    </ThemedView>
  );
}
