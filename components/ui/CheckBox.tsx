import { View, Text, Pressable } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

export default function CheckBox({
  label,
  checked,
  onToggle,
}: {
  label: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <Pressable
      onPress={onToggle}
      style={{
        flexDirection: "row",
        alignItems: "center",
      }}
      hitSlop={8}
    >
      <View
        style={{
          width: 24,
          height: 24,
          borderColor: checked ? "#10b981" : "#6B7280",
          borderWidth: 2,
          borderRadius: 4,
          backgroundColor: "transparent",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {checked && (
          <Ionicons
            name="checkmark"
            size={18}
            color="#10b981"
            style={{ fontWeight: "normal" }}
          />
        )}
      </View>
      <Text
        style={{
          color: "#fff",
          marginLeft: 8,
          fontSize: 18,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}
