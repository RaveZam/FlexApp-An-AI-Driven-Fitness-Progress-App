import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { useWorkoutSession } from "../hooks/useWorkoutSession";

const ACCENT = "#34d399";
const BONE = "#f5f3ef";
const MUTED_SOFT = "#3a3a3a";

type Props = {
  onExit: () => void;
  onShowExercises: () => void;
};

export default function SessionHeader({ onExit, onShowExercises }: Props) {
  const { exercises, activeIndex } = useWorkoutSession();

  const totalExercisesCount = exercises.length;

  return (
    <Animated.View entering={FadeIn.duration(400)} style={styles.header}>
      <TouchableOpacity onPress={onExit} activeOpacity={0.6} hitSlop={10}>
        <Text style={styles.headerAction}>Exit</Text>
      </TouchableOpacity>
      <View style={styles.headerCenter}>
        <Text style={styles.headerEyebrow}>In Session</Text>
        <Text style={styles.headerTitle}>
          {(activeIndex + 1).toString().padStart(2, "0")}{" "}
          <Text style={styles.headerTitleDim}>
            / {totalExercisesCount.toString().padStart(2, "0")}
          </Text>
        </Text>
      </View>
      <TouchableOpacity
        onPress={onShowExercises}
        activeOpacity={0.6}
        hitSlop={10}
      >
        <Text style={styles.headerAction}>Exercises</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 14,
  },
  headerCenter: { alignItems: "center" },
  headerEyebrow: {
    color: ACCENT,
    fontSize: 9,
    fontFamily: "Inter_500Medium",
    letterSpacing: 2.4,
    textTransform: "uppercase",
    marginBottom: 3,
  },
  headerAction: {
    color: BONE,
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    letterSpacing: 1.4,
    textTransform: "uppercase",
    opacity: 0.75,
  },
  headerTitle: {
    color: BONE,
    fontSize: 15,
    fontFamily: "Outfit_500Medium",
    letterSpacing: 1,
    fontVariant: ["tabular-nums"],
  },
  headerTitleDim: { color: MUTED_SOFT, fontFamily: "Outfit_300Light" },
});
