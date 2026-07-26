import { usePalette, type Palette } from "@/src/theme";
import { Ionicons } from "@expo/vector-icons";
import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

type Props = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
};

export default function SessionCompleteCard({ icon, title, subtitle }: Props) {
  const p = usePalette();
  const styles = useMemo(() => makeStyles(p), [p]);
  return (
    <Animated.View entering={FadeInDown.delay(80).duration(400)} style={styles.card}>
      <View style={styles.iconRing}>
        <Ionicons name={icon} size={22} color={p.accent} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </Animated.View>
  );
}

const makeStyles = (p: Palette) =>
  StyleSheet.create({
    card: {
      alignItems: "center",
      justifyContent: "center",
      marginTop: 26,
      marginHorizontal: 20,
      paddingVertical: 28,
      borderRadius: 18,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: p.accentBorderSoft,
      backgroundColor: p.accentSoft,
      gap: 8,
    },
    iconRing: {
      width: 44,
      height: 44,
      borderRadius: 22,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: p.accentBorder,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 4,
    },
    title: {
      color: p.bone,
      fontSize: 18,
      fontFamily: "Outfit_500Medium",
      letterSpacing: -0.2,
    },
    subtitle: {
      color: p.muted,
      fontSize: 11,
      fontFamily: "Inter_400Regular",
      letterSpacing: 1.4,
      textTransform: "uppercase",
    },
  });
