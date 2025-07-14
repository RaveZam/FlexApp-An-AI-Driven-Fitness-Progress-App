import React from "react";
import { TouchableOpacity, View, StyleSheet, ViewStyle } from "react-native";
import { BlurView } from "expo-blur";

interface GlassButtonProps {
  onPress: () => void;
  children: React.ReactNode;
  className?: string;
  style?: ViewStyle;
  accessibilityLabel?: string;
}

const GlassButton: React.FC<GlassButtonProps> = ({
  onPress,
  children,
  className = "",
  style = {},
  accessibilityLabel,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`w-16 h-16 rounded-full items-center justify-center shadow-lg border border-[#1a472a]/30 bg-[#191919]/60 overflow-hidden ${className}`}
      style={style}
      accessibilityLabel={accessibilityLabel}
      activeOpacity={0.8}
    >
      <BlurView
        intensity={40}
        tint="dark"
        style={{ ...StyleSheet.absoluteFillObject, borderRadius: 999 }}
      />
      <View
        style={{
          ...StyleSheet.absoluteFillObject,
          borderRadius: 999,
          backgroundColor: "rgba(16, 185, 129, 0.35)",
        }}
      />
      <View
        style={{
          zIndex: 1,
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
        }}
      >
        {children}
      </View>
    </TouchableOpacity>
  );
};

export default GlassButton;
