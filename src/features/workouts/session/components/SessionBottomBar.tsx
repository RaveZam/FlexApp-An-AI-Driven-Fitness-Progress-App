import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

const ACCENT = "#34d399";
const BONE = "#f5f3ef";

type Mode = "log" | "next" | "finish";

const LABELS: Record<Mode, string> = {
  log: "Log Set",
  next: "Next Exercise",
  finish: "Finish Workout",
};

const ICONS: Record<Mode, React.ComponentProps<typeof Ionicons>["name"]> = {
  log: "add",
  next: "arrow-forward",
  finish: "checkmark",
};

type Props = {
  mode: Mode;
  onPress: () => void;
};

export default function SessionBottomBar({ mode, onPress }: Props) {
  return (
    <Animated.View entering={FadeInDown.delay(280).duration(400)} style={styles.bottomArea}>
      <TouchableOpacity activeOpacity={0.85} onPress={onPress} style={styles.bottomButton}>
        <Text style={styles.bottomButtonText}>{LABELS[mode]}</Text>
        <Animated.View style={styles.bottomButtonGlyph}>
          <Ionicons name={ICONS[mode]} size={14} color={ACCENT} />
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  bottomArea: { paddingHorizontal: 20, paddingTop: 14, paddingBottom: 22 },
  bottomButton: {
    height: 58,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
    backgroundColor: "#0c0c0c",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(52,211,153,0.45)",
  },
  bottomButtonText: {
    color: BONE,
    fontSize: 13,
    fontFamily: "Outfit_500Medium",
    letterSpacing: 2.4,
    textTransform: "uppercase",
  },
  bottomButtonGlyph: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(52,211,153,0.45)",
    alignItems: "center",
    justifyContent: "center",
  },
});
