import { FontFamilies } from "@/constants/theme";
import { usePalette, type Palette } from "@/src/theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

export function CreatePlanButton() {
  const p = usePalette();
  const styles = useMemo(() => makeStyles(p), [p]);
  const router = useRouter();

  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      entering={FadeIn.delay(360).duration(420)}
      style={[styles.ctaWrap, animatedStyle]}
    >
      <Pressable
        onPressIn={() => (scale.value = withTiming(0.97, { duration: 120 }))}
        onPressOut={() => (scale.value = withTiming(1, { duration: 160 }))}
        onPress={() => router.push("/(tabs)/Workouts/create-plan")}
        style={styles.cta}
      >
        <Text style={styles.ctaText}>Create Plan</Text>
        <View style={styles.ctaGlyph}>
          <Ionicons name="add" size={15} color={p.accent} />
        </View>
      </Pressable>
    </Animated.View>
  );
}

const makeStyles = (p: Palette) =>
  StyleSheet.create({
    ctaWrap: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 14 },
    cta: {
      height: 56,
      borderRadius: 16,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 14,
      backgroundColor: p.inkRaised,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: p.accentBorder,
    },
    ctaText: {
      color: p.bone,
      fontSize: 12,
      fontFamily: FontFamilies.displayMedium,
      letterSpacing: 2.4,
      textTransform: "uppercase",
    },
    ctaGlyph: {
      width: 22,
      height: 22,
      borderRadius: 11,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: p.accentBorder,
      alignItems: "center",
      justifyContent: "center",
    },
  });
