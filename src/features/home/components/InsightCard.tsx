import React from "react";
import { Text, View } from "react-native";

interface InsightCardProps {
  icon: React.ReactNode;
  mainText: string;
  subText: string;
}

export function InsightCard({ icon, mainText, subText }: InsightCardProps) {
  return (
    <View className="flex-row gap-2 p-4 rounded-xl bg-[#191919]/60 border border-[#1a472a]/30 backdrop-blur-sm">
      <View className="w-12 h-12 rounded-full items-center justify-center mr-4 bg-[#1a472a]/40">
        {icon}
      </View>
      <View className="flex-1">
        <Text className="text-white text-base font-medium">{mainText}</Text>
        <Text className="text-gray-400 text-xs mt-1">{subText}</Text>
      </View>
    </View>
  );
}
