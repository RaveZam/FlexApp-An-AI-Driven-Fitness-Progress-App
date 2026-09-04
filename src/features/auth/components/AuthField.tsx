import { FontFamilies } from "@/constants/theme";
import { usePalette, type Palette } from "@/src/theme";
import { useMemo, useState } from "react";
import { StyleSheet, Text, TextInput, View, type TextInputProps } from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

type Props = TextInputProps & { label: string };

/**
 * A labelled text field for the auth screens: an uppercase eyebrow label
 * over a filled `inkRaised` box whose border and label brighten to
 * `accent` while the field holds focus.
 */
export default function AuthField({ label, onFocus, onBlur, ...inputProps }: Props) {
  const p = usePalette();
  const styles = useMemo(() => makeStyles(p), [p]);
  const reduceMotion = useReducedMotion();
  const [focused, setFocused] = useState(false);

  const focus = useSharedValue(0);
  const setFocus = (to: number) => {
    focus.value = reduceMotion ? to : withTiming(to, { duration: 160 });
  };

  const boxStyle = useAnimatedStyle(() => ({
    borderColor: interpolateColor(
      focus.value,
      [0, 1],
      [p.hairlineStrong, p.accent],
    ),
  }));

  return (
    <View style={styles.field}>
      <Text style={[styles.label, focused && { color: p.accent }]}>{label}</Text>
      <Animated.View style={[styles.box, boxStyle]}>
        <AnimatedTextInput
          {...inputProps}
          placeholderTextColor={p.mutedSoft}
          selectionColor={p.accent}
          style={styles.input}
          onFocus={(e) => {
            setFocused(true);
            setFocus(1);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            setFocus(0);
            onBlur?.(e);
          }}
        />
      </Animated.View>
    </View>
  );
}

const makeStyles = (p: Palette) =>
  StyleSheet.create({
    field: { marginBottom: 18 },
    label: {
      color: p.muted,
      fontSize: 9,
      fontFamily: FontFamilies.medium,
      letterSpacing: 2,
      textTransform: "uppercase",
      marginBottom: 8,
    },
    box: {
      backgroundColor: p.inkRaised,
      borderRadius: 12,
      borderWidth: 1,
      paddingHorizontal: 16,
    },
    input: {
      color: p.bone,
      fontSize: 16,
      fontFamily: FontFamilies.regular,
      height: 52,
    },
  });
