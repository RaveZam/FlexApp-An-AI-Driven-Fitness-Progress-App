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
import type { Workout } from "../../types";
import { WorkoutDayChips } from "./WorkoutDayChips";

type Props = { workout: Workout; index: number; onPress: () => void };

export function PlanWorkoutCard({ workout, index, onPress }: Props) {
  const p = usePalette();
  const styles = useMemo(() => makeStyles(p), [p]);
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const exerciseCount = workout.exercises.length;

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

          <Text style={styles.ghostIndex}>
            {String(index + 1).padStart(2, "0")}
          </Text>

          <View style={styles.cardBody}>
            <View style={styles.cardHead}>
              <Text style={styles.cardEyebrow}>
                Day {String(index + 1).padStart(2, "0")}
              </Text>
              <Ionicons name="arrow-forward" size={14} color={p.accent} />
            </View>

            <Text style={styles.cardName} numberOfLines={1}>
              {workout.name}
            </Text>

            <View style={styles.metaItem}>
              <Ionicons name="barbell-outline" size={12} color={p.muted} />
              <Text style={styles.metaText}>
                {exerciseCount} exercise{exerciseCount !== 1 ? "s" : ""}
              </Text>
            </View>

            <WorkoutDayChips days={workout.daysOfWeek} />
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
    },
    rail: { width: 3, alignSelf: "stretch" },
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
    cardBody: {
      flex: 1,
      paddingVertical: 16,
      paddingLeft: 16,
      paddingRight: 16,
    },
    cardHead: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 5,
    },
    cardEyebrow: {
      color: p.accent,
      fontSize: 9,
      fontFamily: FontFamilies.medium,
      letterSpacing: 2.4,
      textTransform: "uppercase",
    },
    cardName: {
      color: p.bone,
      fontSize: 18,
      fontFamily: FontFamilies.displayMedium,
      letterSpacing: -0.4,
      marginBottom: 9,
    },
    metaItem: { flexDirection: "row", alignItems: "center", gap: 5 },
    metaText: {
      color: p.muted,
      fontSize: 11.5,
      fontFamily: FontFamilies.regular,
      letterSpacing: 0.2,
    },
  });
