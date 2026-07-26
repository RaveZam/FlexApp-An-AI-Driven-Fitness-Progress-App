import { FontFamilies } from "@/constants/theme";
import { usePalette, type Palette } from "@/src/theme";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import type { WorkoutPlan } from "../types";

type Props = { plan: WorkoutPlan; index: number; onPress: () => void };

export function PlanCard({ plan, index, onPress }: Props) {
  const p = usePalette();
  const styles = useMemo(() => makeStyles(p), [p]);
  const dayCount = plan.workouts.length;
  const exerciseCount = plan.workouts.reduce(
    (sum, workout) => sum + workout.exercises.length,
    0
  );

  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View entering={FadeInDown.delay(160 + index * 70).duration(420)}>
      <Pressable
        onPressIn={() => (scale.value = withTiming(0.97, { duration: 120 }))}
        onPressOut={() => (scale.value = withTiming(1, { duration: 160 }))}
        onPress={onPress}
      >
        <Animated.View style={[styles.card, animatedStyle]}>
          <LinearGradient
            colors={[p.accent, p.accentDeep]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.rail}
          />

          {/* Ghosted index numeral — editorial texture */}
          <Text style={styles.ghostIndex}>
            {String(index + 1).padStart(2, "0")}
          </Text>

          <View style={styles.body}>
            <Text style={styles.eyebrow}>
              Plan {String(index + 1).padStart(2, "0")}
            </Text>
            <Text style={styles.name} numberOfLines={1}>
              {plan.name}
            </Text>

            <View style={styles.metaRow}>
              <View style={styles.metaItem}>
                <Ionicons name="calendar-outline" size={12} color={p.muted} />
                <Text style={styles.metaText}>
                  {dayCount} day{dayCount !== 1 ? "s" : ""}
                </Text>
              </View>
              <View style={styles.metaDot} />
              <View style={styles.metaItem}>
                <Ionicons name="barbell-outline" size={12} color={p.muted} />
                <Text style={styles.metaText}>
                  {exerciseCount} exercise{exerciseCount !== 1 ? "s" : ""}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.chevron}>
            <Ionicons name="arrow-forward" size={15} color={p.accent} />
          </View>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

const makeStyles = (p: Palette) =>
  StyleSheet.create({
    card: {
      backgroundColor: p.inkRaised,
      borderRadius: 16,
      overflow: "hidden",
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: p.hairline,
      flexDirection: "row",
      alignItems: "center",
    },
    rail: {
      width: 3,
      alignSelf: "stretch",
    },
    ghostIndex: {
      position: "absolute",
      right: 8,
      bottom: -14,
      color: p.bone,
      opacity: 0.03,
      fontSize: 76,
      fontFamily: FontFamilies.displaySemibold,
      letterSpacing: -2,
    },
    body: {
      flex: 1,
      paddingVertical: 16,
      paddingLeft: 16,
      paddingRight: 12,
    },
    eyebrow: {
      color: p.accent,
      fontSize: 9,
      fontFamily: FontFamilies.medium,
      letterSpacing: 2.4,
      textTransform: "uppercase",
      marginBottom: 5,
    },
    name: {
      color: p.bone,
      fontSize: 18,
      fontFamily: FontFamilies.displayMedium,
      letterSpacing: -0.4,
      marginBottom: 9,
    },
    metaRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 9,
    },
    metaItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
    },
    metaText: {
      color: p.muted,
      fontSize: 11.5,
      fontFamily: FontFamilies.regular,
      letterSpacing: 0.2,
    },
    metaDot: {
      width: 3,
      height: 3,
      borderRadius: 1.5,
      backgroundColor: p.mutedSoft,
    },
    chevron: {
      width: 34,
      height: 34,
      borderRadius: 17,
      marginRight: 14,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: p.accentBorderSoft,
      backgroundColor: p.accentSoft,
    },
  });
