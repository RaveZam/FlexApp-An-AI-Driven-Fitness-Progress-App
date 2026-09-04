import { FontFamilies } from "@/constants/theme";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import GoogleLogo from "./GoogleLogo";

/**
 * Google sign-in button. Stays white with black text and the four-colour
 * "G" per Google's brand guidelines — it is deliberately not app-themed.
 * Matches ActionButton's height so the two stack evenly.
 */
export default function GoogleButton({
  onPress,
  disabled = false,
  label = "Continue with Google",
}: {
  onPress: () => void;
  disabled?: boolean;
  label?: string;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
      accessibilityRole="button"
      style={[styles.button, disabled && styles.disabled]}
    >
      <GoogleLogo size={18} />
      <Text style={styles.text}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 56,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  disabled: { opacity: 0.5 },
  text: {
    color: "#000000",
    fontSize: 14,
    fontFamily: FontFamilies.semibold,
  },
});
