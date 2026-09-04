import { FontFamilies } from "@/constants/theme";
import { usePalette, type Palette } from "@/src/theme";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect, useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";

/**
 * The FlexLife wordmark for the auth screens, with the screen's one
 * orchestrated motion moment: the mark settles in and the hairline rule
 * beneath it draws left-to-right on mount. Everything else on the screen
 * only fades.
 */
export default function AuthBrand({ title, subtitle }: { title: string; subtitle: string }) {
  const p = usePalette();
  const styles = useMemo(() => makeStyles(p), [p]);
  const reduceMotion = useReducedMotion();

  const markOpacity = useSharedValue(0);
  const markShift = useSharedValue(-8);
  const rule = useSharedValue(0);

  useEffect(() => {
    if (reduceMotion) {
      markOpacity.value = 1;
      markShift.value = 0;
      rule.value = 1;
      return;
    }
    markOpacity.value = withTiming(1, { duration: 360 });
    markShift.value = withSpring(0, { damping: 22, stiffness: 220 });
    rule.value = withDelay(260, withTiming(1, { duration: 520 }));
  }, [reduceMotion, markOpacity, markShift, rule]);

  const markStyle = useAnimatedStyle(() => ({
    opacity: markOpacity.value,
    transform: [{ translateY: markShift.value }],
  }));
  const ruleStyle = useAnimatedStyle(() => ({ transform: [{ scaleX: rule.value }] }));

  return (
    <View>
      <Animated.View style={[styles.mark, markStyle]}>
        <Ionicons name="barbell" size={30} color={p.bone} />
        <Text style={styles.wordmark}>
          Flex<Text style={styles.wordmarkAccent}>Life</Text>
        </Text>
      </Animated.View>

      <Animated.View style={[styles.rule, ruleStyle]} />

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}

const makeStyles = (p: Palette) =>
  StyleSheet.create({
    mark: { flexDirection: "row", alignItems: "center", gap: 12 },
    wordmark: {
      color: p.bone,
      fontSize: 24,
      fontFamily: FontFamilies.displayMedium,
      letterSpacing: -0.5,
    },
    wordmarkAccent: { color: p.accent, fontFamily: FontFamilies.displayLight },
    rule: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: p.hairlineStrong,
      marginTop: 18,
      marginBottom: 28,
      alignSelf: "stretch",
      // Draw from the left edge as scaleX animates 0 -> 1.
      transformOrigin: "left",
    },
    title: {
      color: p.bone,
      fontSize: 30,
      fontFamily: FontFamilies.displayLight,
      letterSpacing: -0.8,
    },
    subtitle: {
      color: p.muted,
      fontSize: 13,
      fontFamily: FontFamilies.regular,
      marginTop: 8,
      lineHeight: 19,
    },
  });
