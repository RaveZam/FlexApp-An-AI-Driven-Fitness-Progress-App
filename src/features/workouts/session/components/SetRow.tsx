import { SessionSetRow } from "@/src/lib/dao/sessionSets";
import { usePalette, type Palette } from "@/src/theme";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

type SetRowProps = {
  set: SessionSetRow;
  isCurrent: boolean;
  index: number;
  onEdit?: (setId: string) => void;
};

export default function SetRow({ set, isCurrent, index, onEdit }: SetRowProps) {
  const p = usePalette();
  const styles = useMemo(() => makeStyles(p), [p]);
  const isCompleted = set.completed;
  const isFuture = !isCompleted && !isCurrent;
  const editable = isCompleted && !!onEdit;
  const hasPerSide = set.actualRepsLeft != null || set.actualRepsRight != null;

  return (
    <Animated.View entering={FadeInDown.delay(160 + index * 70).duration(420)}>
      <Pressable
        onPress={editable ? () => onEdit!(set.id) : undefined}
        disabled={!editable}
        android_ripple={editable ? { color: p.accentSoft } : undefined}
        style={[
          styles.pill,
          isCompleted && styles.pillCompleted,
          isCurrent && styles.pillCurrent,
          isFuture && styles.pillFuture,
        ]}
      >
        {isCurrent && (
          <LinearGradient
            colors={[p.accentBorderSoft, p.accentSoft]}
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
              <Ionicons name="checkmark" size={14} color={p.accent} />
            </View>
          ) : isCurrent ? (
            <View style={styles.glyph}>
              <Ionicons name="arrow-forward" size={14} color={p.accent} />
            </View>
          ) : (
            <View style={styles.dotFuture} />
          )}
        </View>
      </Pressable>
    </Animated.View>
  );
}

const makeStyles = (p: Palette) =>
  StyleSheet.create({
    pill: {
      flexDirection: "row",
      alignItems: "center",
      height: 64,
      borderRadius: 16,
      paddingHorizontal: 6,
      overflow: "hidden",
      borderWidth: StyleSheet.hairlineWidth,
      backgroundColor: p.inkRaised,
    },
    pillCompleted: {
      backgroundColor: p.inkRaised,
      borderColor: p.accentBorderSoft,
    },
    pillCurrent: {
      backgroundColor: p.inkRaised,
      borderColor: p.accentBorder,
    },
    pillFuture: {
      backgroundColor: p.inkSunken,
      borderColor: p.hairline,
      opacity: 0.7,
    },

    divider: {
      width: StyleSheet.hairlineWidth,
      height: 30,
      backgroundColor: p.hairlineStrong,
    },

    inline: { flexDirection: "row", alignItems: "baseline" },

    // Weight column
    weightCol: { width: 92, alignItems: "center", justifyContent: "center" },
    weightValue: {
      color: p.bone,
      fontSize: 20,
      fontFamily: "Outfit_400Regular",
      letterSpacing: -0.3,
      fontVariant: ["tabular-nums"],
    },
    weightUnit: {
      color: p.muted,
      fontSize: 11,
      fontFamily: "Inter_500Medium",
      marginLeft: 2,
    },
    weightDash: {
      color: p.muted,
      fontSize: 20,
      fontFamily: "Outfit_300Light",
    },
    weightDashFuture: {
      color: p.mutedSoft,
      fontSize: 20,
      fontFamily: "Outfit_300Light",
    },
    weightUnitFuture: {
      color: p.mutedSoft,
      fontSize: 11,
      fontFamily: "Inter_400Regular",
      marginLeft: 2,
    },

    // Reps column
    repsCol: { flex: 1, alignItems: "center", justifyContent: "center" },
    repsValue: {
      color: p.bone,
      fontSize: 19,
      fontFamily: "Outfit_400Regular",
      letterSpacing: -0.2,
      fontVariant: ["tabular-nums"],
    },
    repsValueFuture: {
      color: p.muted,
      fontSize: 19,
      fontFamily: "Outfit_300Light",
      fontVariant: ["tabular-nums"],
    },
    repsLabel: { color: p.muted, fontSize: 13, fontFamily: "Inter_400Regular" },
    repsLabelAccent: {
      color: p.accent,
      fontSize: 13,
      fontFamily: "Inter_500Medium",
    },
    repsLabelFuture: {
      color: p.mutedSoft,
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
      borderColor: p.accentBorder,
    },
    dotFuture: {
      width: 7,
      height: 7,
      borderRadius: 4,
      backgroundColor: p.mutedSoft,
    },
  });
