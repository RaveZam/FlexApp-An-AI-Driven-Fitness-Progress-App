import React from "react";
import { Text, View } from "react-native";

export default function BlurOverlay({
  collapsed,
  style,
}: {
  collapsed: boolean;
  style?: any;
}) {
  return (
    <View
      className={`absolute inset-0 w-full h-full bg-black z-10 opacity-50 ${
        collapsed ? "block" : "hidden"
      }`}
      style={style}
    >
      <Text>.</Text>
    </View>
  );
}
