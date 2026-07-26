import { usePalette, type Palette } from "@/src/theme";
import { LinearGradient } from "expo-linear-gradient";
import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useWorkoutSession } from "../hooks/useWorkoutSession";

export default function SessionExerciseCard() {
  const p = usePalette();
  const styles = useMemo(() => makeStyles(p), [p]);
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
        colors={[p.accentSoft, "transparent"]}
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

const makeStyles = (p: Palette) =>
  StyleSheet.create({
    card: {
      flexDirection: "row",
      alignItems: "center",
      marginHorizontal: 20,
      marginTop: 22,
      borderRadius: 18,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: p.hairlineStrong,
      backgroundColor: p.inkRaised,
      overflow: "hidden",
    },
    rail: {
      alignSelf: "stretch",
      width: 2,
      backgroundColor: p.accent,
      opacity: 0.7,
    },
    body: {
      flex: 1,
      paddingVertical: 18,
      paddingLeft: 18,
      paddingRight: 16,
    },
    eyebrow: {
      color: p.accent,
      fontSize: 10,
      fontFamily: "Inter_600SemiBold",
      letterSpacing: 2.6,
      textTransform: "uppercase",
      marginBottom: 7,
    },
    name: {
      color: p.bone,
      fontSize: 23,
      lineHeight: 27,
      fontFamily: "Outfit_600SemiBold",
      letterSpacing: -0.5,
    },
    meta: {
      color: p.muted,
      fontSize: 12,
      fontFamily: "Inter_400Regular",
      letterSpacing: 0.4,
      marginTop: 6,
    },
  });
