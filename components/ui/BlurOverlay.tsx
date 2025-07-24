import React from "react";
import { View } from "react-native";

export default function BlurOverlay({
  collapsed,
  style,
}: {
  collapsed: boolean;
  style?: any;
}) {
  return (
    <View
      className={`absolute inset-0 w-full transition-all duration-300 h-full bg-black z-10 opacity-50 ${
        collapsed ? "block" : "hidden"
      }`}
      style={style}
    >
      .
    </View>
  );
}
