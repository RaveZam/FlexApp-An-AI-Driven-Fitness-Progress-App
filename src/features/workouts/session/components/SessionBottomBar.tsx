import { usePalette, type Palette } from "@/src/theme";
import { Ionicons } from "@expo/vector-icons";
import React, { useMemo } from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

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
  const p = usePalette();
  const styles = useMemo(() => makeStyles(p), [p]);
  return (
    <Animated.View entering={FadeInDown.delay(280).duration(400)} style={styles.bottomArea}>
      <TouchableOpacity activeOpacity={0.85} onPress={onPress} style={styles.bottomButton}>
        <Text style={styles.bottomButtonText}>{LABELS[mode]}</Text>
        <Animated.View style={styles.bottomButtonGlyph}>
          <Ionicons name={ICONS[mode]} size={14} color={p.accent} />
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const makeStyles = (p: Palette) =>
  StyleSheet.create({
    bottomArea: { paddingHorizontal: 20, paddingTop: 14, paddingBottom: 22 },
    bottomButton: {
      height: 58,
      borderRadius: 14,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 14,
      backgroundColor: p.inkRaised,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: p.accentBorder,
    },
    bottomButtonText: {
      color: p.bone,
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
      borderColor: p.accentBorder,
      alignItems: "center",
      justifyContent: "center",
    },
  });
