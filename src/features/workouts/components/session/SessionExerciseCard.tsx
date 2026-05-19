import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

const ACCENT = "#34d399";
const BONE = "#f5f3ef";
const HAIRLINE_STRONG = "rgba(245,243,239,0.14)";
const MUTED = "#6b6b6b";

type Props = {
  name: string;
  setCount: number;
  targetReps: number | undefined;
};

export default function SessionExerciseCard({ name, setCount, targetReps }: Props) {
  return (
    <Animated.View entering={FadeInDown.delay(120).duration(500)} style={styles.exerciseCard}>
      <LinearGradient
        colors={["rgba(52,211,153,0.10)", "rgba(52,211,153,0)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />
      <View style={styles.exerciseCardInner}>
        <View style={styles.exerciseMedallion}>
          <View style={styles.medallionInner}>
            <Ionicons name="barbell" size={26} color={ACCENT} />
          </View>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.exerciseEyebrow}>Current Lift</Text>
          <Text style={styles.exerciseName}>{name}</Text>
          <Text style={styles.exerciseMeta}>
            {setCount} sets · target {targetReps ?? "—"} reps
          </Text>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  exerciseCard: {
    marginHorizontal: 20,
    marginTop: 22,
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: HAIRLINE_STRONG,
    backgroundColor: "#0c0c0c",
    overflow: "hidden",
  },
  exerciseCardInner: {
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
    gap: 16,
  },
  exerciseMedallion: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(52,211,153,0.45)",
    alignItems: "center",
    justifyContent: "center",
    padding: 6,
  },
  medallionInner: {
    flex: 1,
    width: "100%",
    borderRadius: 30,
    backgroundColor: "rgba(52,211,153,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  exerciseEyebrow: {
    color: ACCENT,
    fontSize: 9,
    fontFamily: "Inter_500Medium",
    letterSpacing: 2.2,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  exerciseName: {
    color: BONE,
    fontSize: 22,
    fontFamily: "Outfit_500Medium",
    letterSpacing: -0.4,
    marginBottom: 4,
  },
  exerciseMeta: {
    color: MUTED,
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    letterSpacing: 0.2,
  },
});
