import React, { useMemo } from "react";
import { TouchableOpacity, View, StyleSheet, ViewStyle } from "react-native";
import { BlurView } from "expo-blur";
import { usePalette, type Palette } from "@/src/theme";

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
  const p = usePalette();
  const styles = useMemo(() => makeStyles(p), [p]);
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`w-16 h-16 rounded-full items-center justify-center shadow-lg overflow-hidden ${className}`}
      style={[styles.button, style]}
      accessibilityLabel={accessibilityLabel}
      activeOpacity={0.8}
    >
      <View style={[StyleSheet.absoluteFillObject, styles.baseFill]} />
      <BlurView
        intensity={40}
        tint="dark"
        style={{ ...StyleSheet.absoluteFillObject, borderRadius: 999 }}
      />
      <View style={[StyleSheet.absoluteFillObject, styles.accentTint]} />
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

const makeStyles = (p: Palette) => StyleSheet.create({
  button: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: p.hairlineStrong,
  },
  baseFill: {
    borderRadius: 999,
    backgroundColor: p.inkRaised,
    opacity: 0.6,
  },
  accentTint: {
    borderRadius: 999,
    backgroundColor: p.accent,
    opacity: 0.35,
  },
});

export default GlassButton;
