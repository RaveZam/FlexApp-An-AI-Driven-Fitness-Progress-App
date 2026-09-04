import { FontFamilies } from "@/constants/theme";
import { usePalette, useTheme, type Palette } from "@/src/theme";
import { useMemo } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface ActionButtonProps {
  onPress: () => void;
  title: string;
  disabled?: boolean;
}

export default function ActionButton({
  onPress,
  title,
  disabled = false,
}: ActionButtonProps) {
  const p = usePalette();
  const { scheme } = useTheme();
  const styles = useMemo(() => makeStyles(p, scheme), [p, scheme]);
  const reduceMotion = useReducedMotion();

  const dim = useSharedValue(1);
  const fade = useAnimatedStyle(() => ({ opacity: dim.value }));

  const press = (to: number) => {
    if (disabled) return;
    dim.value = reduceMotion ? to : withTiming(to, { duration: 140 });
  };

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={() => press(0.82)}
      onPressOut={() => press(1)}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      style={[styles.button, disabled && styles.buttonDisabled, fade]}
    >
      <Text style={[styles.text, disabled && { color: p.mutedSoft }]}>
        {title}
      </Text>
    </AnimatedPressable>
  );
}

const makeStyles = (p: Palette, scheme: "light" | "dark") =>
  StyleSheet.create({
    button: {
      height: 56,
      borderRadius: 14,
      alignItems: "center",
      justifyContent: "center",
      // The light palette's accent is a mid-tone that clears 4.5:1 against
      // neither text pole, so light mode fills with the deep rung instead.
      // `ink` is the background-side color in both schemes, which makes it
      // the correct label color against either fill.
      backgroundColor: scheme === "dark" ? p.accent : p.accentDeep,
    },
    buttonDisabled: {
      backgroundColor: p.inkRaised,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: p.hairlineStrong,
    },
    text: {
      color: p.ink,
      fontSize: 11,
      fontFamily: FontFamilies.displayRegular,
      letterSpacing: 3,
      textTransform: "uppercase",
    },
  });
