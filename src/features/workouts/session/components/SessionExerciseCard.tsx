import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useWorkoutSession } from "../hooks/useWorkoutSession";

const ACCENT = "#34d399";
const BONE = "#f5f3ef";
const MUTED = "#6b6b6b";

export default function SessionExerciseCard() {
  const { exercises, activeIndex } = useWorkoutSession();

  const active = exercises[activeIndex];
  const setLabel = `${active.targetSets} set${active.targetSets !== 1 ? "s" : ""}`;
  const meta = `${setLabel} · ${active.targetReps} reps target`;

  return (
    <Animated.View
      entering={FadeInDown.delay(120).duration(500)}
      style={styles.card}
    >
      <LinearGradient
        colors={["rgba(52,211,153,0.10)", "rgba(52,211,153,0.0)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
        pointerEvents="none"
      />
      <View style={styles.rail} />

      <View style={styles.body}>
        <Text style={styles.eyebrow}>Now Lifting</Text>
        <Text style={styles.name} numberOfLines={2}>
          {active.name}
        </Text>
        <Text style={styles.meta}>{meta}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginTop: 22,
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(245,243,239,0.12)",
    backgroundColor: "#0b0b0b",
    overflow: "hidden",
  },
  rail: {
    alignSelf: "stretch",
    width: 2,
    backgroundColor: ACCENT,
    opacity: 0.7,
  },
  body: {
    flex: 1,
    paddingVertical: 18,
    paddingLeft: 18,
    paddingRight: 16,
  },
  eyebrow: {
    color: ACCENT,
    fontSize: 10,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 2.6,
    textTransform: "uppercase",
    marginBottom: 7,
  },
  name: {
    color: BONE,
    fontSize: 23,
    lineHeight: 27,
    fontFamily: "Outfit_600SemiBold",
    letterSpacing: -0.5,
  },
  meta: {
    color: MUTED,
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    letterSpacing: 0.4,
    marginTop: 6,
  },
});
