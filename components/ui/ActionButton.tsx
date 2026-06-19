import { FontFamilies, Palette } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
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
  return (
    <TouchableOpacity
      activeOpacity={disabled ? 1 : 0.85}
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        disabled && { borderColor: Palette.hairlineStrong, opacity: 0.6 },
      ]}
    >
      <Text style={styles.text}>{title}</Text>
      <View style={styles.glyph}>
        <Ionicons
          name={icon}
          size={12}
          color={disabled ? Palette.mutedSoft : Palette.accent}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 56,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
    backgroundColor: Palette.inkRaised,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Palette.accentBorder,
  },
  text: {
    color: Palette.bone,
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
    borderColor: Palette.accentBorder,
    alignItems: "center",
    justifyContent: "center",
  },
});
