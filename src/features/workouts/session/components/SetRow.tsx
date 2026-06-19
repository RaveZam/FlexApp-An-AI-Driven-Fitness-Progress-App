import { SessionSetRow } from "@/src/lib/dao/sessionSets";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

const ACCENT = "#34d399";
const BONE = "#f5f3ef";
const MUTED = "#6b6b6b";
const MUTED_SOFT = "#3a3a3a";
const HAIRLINE = "rgba(245,243,239,0.07)";
const HAIRLINE_STRONG = "rgba(245,243,239,0.14)";
const ACCENT_BORDER = "rgba(52,211,153,0.45)";
const ACCENT_BORDER_SOFT = "rgba(52,211,153,0.18)";
const ACCENT_TINT = "rgba(52,211,153,0.12)";

type SetRowProps = {
  set: SessionSetRow;
  isCurrent: boolean;
  index: number;
  onEdit?: (setId: string) => void;
};

export default function SetRow({ set, isCurrent, index, onEdit }: SetRowProps) {
  const isCompleted = set.completed;
  const isFuture = !isCompleted && !isCurrent;
  const editable = isCompleted && !!onEdit;
  const hasPerSide = set.actualRepsLeft != null || set.actualRepsRight != null;

  return (
    <Animated.View entering={FadeInDown.delay(160 + index * 70).duration(420)}>
      <Pressable
        onPress={editable ? () => onEdit!(set.id) : undefined}
        disabled={!editable}
        android_ripple={editable ? { color: ACCENT_TINT } : undefined}
        style={[
          styles.pill,
          isCompleted && styles.pillCompleted,
          isCurrent && styles.pillCurrent,
          isFuture && styles.pillFuture,
        ]}
      >
        {isCurrent && (
          <LinearGradient
            colors={["rgba(52,211,153,0.14)", "rgba(52,211,153,0.03)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        )}

        {/* Weight */}
        <View style={styles.weightCol}>
          {isCompleted ? (
            <View style={styles.inline}>
              <Text style={styles.weightValue}>{set.weight}</Text>
              <Text style={styles.weightUnit}>lb</Text>
            </View>
          ) : (
            <View style={styles.inline}>
              <Text
                style={isCurrent ? styles.weightDash : styles.weightDashFuture}
              >
                —
              </Text>
              <Text
                style={isCurrent ? styles.weightUnit : styles.weightUnitFuture}
              >
                lb
              </Text>
            </View>
          )}
        </View>

        <View style={styles.divider} />

        {/* Reps */}
        <View style={styles.repsCol}>
          {isCompleted ? (
            hasPerSide ? (
              <Text style={styles.repsValue}>
                {set.actualRepsLeft ?? 0}/{set.actualRepsRight ?? 0}{" "}
                <Text style={styles.repsLabel}>L/R</Text>
              </Text>
            ) : (
              <Text style={styles.repsValue}>
                {set.actualReps} <Text style={styles.repsLabel}>Reps</Text>
              </Text>
            )
          ) : isCurrent ? (
            <Text style={styles.repsValue}>
              {set.targetReps}{" "}
              <Text style={styles.repsLabelAccent}>target</Text>
            </Text>
          ) : (
            <Text style={styles.repsValueFuture}>
              {set.targetReps}{" "}
              <Text style={styles.repsLabelFuture}>target</Text>
            </Text>
          )}
        </View>

        <View style={styles.divider} />

        {/* Action */}
        <View style={styles.actionCol}>
          {isCompleted ? (
            <View style={styles.glyph}>
              <Ionicons name="checkmark" size={14} color={ACCENT} />
            </View>
          ) : isCurrent ? (
            <View style={styles.glyph}>
              <Ionicons name="arrow-forward" size={14} color={ACCENT} />
            </View>
          ) : (
            <View style={styles.dotFuture} />
          )}
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: "row",
    alignItems: "center",
    height: 64,
    borderRadius: 16,
    paddingHorizontal: 6,
    overflow: "hidden",
    borderWidth: StyleSheet.hairlineWidth,
    backgroundColor: "#0c0c0c",
  },
  pillCompleted: {
    backgroundColor: "#0d0d0d",
    borderColor: ACCENT_BORDER_SOFT,
  },
  pillCurrent: {
    backgroundColor: "#0c0c0c",
    borderColor: ACCENT_BORDER,
  },
  pillFuture: {
    backgroundColor: "#0a0a0a",
    borderColor: HAIRLINE,
    opacity: 0.7,
  },

  divider: {
    width: StyleSheet.hairlineWidth,
    height: 30,
    backgroundColor: HAIRLINE_STRONG,
  },

  inline: { flexDirection: "row", alignItems: "baseline" },

  // Weight column
  weightCol: { width: 92, alignItems: "center", justifyContent: "center" },
  weightValue: {
    color: BONE,
    fontSize: 20,
    fontFamily: "Outfit_400Regular",
    letterSpacing: -0.3,
    fontVariant: ["tabular-nums"],
  },
  weightUnit: {
    color: MUTED,
    fontSize: 11,
    fontFamily: "Inter_500Medium",
    marginLeft: 2,
  },
  weightDash: {
    color: MUTED,
    fontSize: 20,
    fontFamily: "Outfit_300Light",
  },
  weightDashFuture: {
    color: MUTED_SOFT,
    fontSize: 20,
    fontFamily: "Outfit_300Light",
  },
  weightUnitFuture: {
    color: MUTED_SOFT,
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    marginLeft: 2,
  },

  // Reps column
  repsCol: { flex: 1, alignItems: "center", justifyContent: "center" },
  repsValue: {
    color: BONE,
    fontSize: 19,
    fontFamily: "Outfit_400Regular",
    letterSpacing: -0.2,
    fontVariant: ["tabular-nums"],
  },
  repsValueFuture: {
    color: MUTED,
    fontSize: 19,
    fontFamily: "Outfit_300Light",
    fontVariant: ["tabular-nums"],
  },
  repsLabel: { color: MUTED, fontSize: 13, fontFamily: "Inter_400Regular" },
  repsLabelAccent: {
    color: ACCENT,
    fontSize: 13,
    fontFamily: "Inter_500Medium",
  },
  repsLabelFuture: {
    color: MUTED_SOFT,
    fontSize: 13,
    fontFamily: "Inter_400Regular",
  },

  // Action column
  actionCol: { width: 64, alignItems: "center", justifyContent: "center" },
  glyph: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: ACCENT_BORDER,
  },
  dotFuture: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: MUTED_SOFT,
  },
});
