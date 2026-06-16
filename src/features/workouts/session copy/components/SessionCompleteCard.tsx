import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

const ACCENT = "#34d399";
const BONE = "#f5f3ef";
const MUTED = "#6b6b6b";

type Props = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
};

export default function SessionCompleteCard({ icon, title, subtitle }: Props) {
  return (
    <Animated.View entering={FadeInDown.delay(80).duration(400)} style={styles.card}>
      <View style={styles.iconRing}>
        <Ionicons name={icon} size={22} color={ACCENT} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 26,
    marginHorizontal: 20,
    paddingVertical: 28,
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(52,211,153,0.25)",
    backgroundColor: "rgba(52,211,153,0.03)",
    gap: 8,
  },
  iconRing: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(52,211,153,0.5)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  title: {
    color: BONE,
    fontSize: 18,
    fontFamily: "Outfit_500Medium",
    letterSpacing: -0.2,
  },
  subtitle: {
    color: MUTED,
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    letterSpacing: 1.4,
    textTransform: "uppercase",
  },
});
