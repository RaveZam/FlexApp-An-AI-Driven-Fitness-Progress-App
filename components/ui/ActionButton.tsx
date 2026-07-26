import { FontFamilies } from "@/constants/theme";
import { usePalette, type Palette } from "@/src/theme";
import { Ionicons } from "@expo/vector-icons";
import { useMemo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ActionButtonProps {
  onPress: () => void;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  disabled?: boolean;
}

export default function ActionButton({
  onPress,
  title,
  icon,
  disabled = false,
}: ActionButtonProps) {
  const p = usePalette();
  const styles = useMemo(() => makeStyles(p), [p]);
  return (
    <TouchableOpacity
      activeOpacity={disabled ? 1 : 0.85}
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        disabled && { borderColor: p.hairlineStrong, opacity: 0.6 },
      ]}
    >
      <Text style={styles.text}>{title}</Text>
      <View style={styles.glyph}>
        <Ionicons
          name={icon}
          size={12}
          color={disabled ? p.mutedSoft : p.accent}
        />
      </View>
    </TouchableOpacity>
  );
}

const makeStyles = (p: Palette) => StyleSheet.create({
  button: {
    height: 56,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
    backgroundColor: p.inkRaised,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: p.accentBorder,
  },
  text: {
    color: p.bone,
    fontSize: 12,
    fontFamily: FontFamilies.displayMedium,
    letterSpacing: 2.4,
    textTransform: "uppercase",
  },
  glyph: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: p.accentBorder,
    alignItems: "center",
    justifyContent: "center",
  },
});
