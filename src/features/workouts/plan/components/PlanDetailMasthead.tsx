import { FontFamilies } from "@/constants/theme";
import { usePalette, type Palette } from "@/src/theme";
import { Ionicons } from "@expo/vector-icons";
import { useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import type { WorkoutPlan } from "../../types";
import { getPlanTotals } from "../core/planTotals";

type Props = {
  plan: WorkoutPlan;
  isActive: boolean;
  onToggleActive: () => void;
};

export function PlanDetailMasthead({ plan, isActive, onToggleActive }: Props) {
  const p = usePalette();
  const styles = useMemo(() => makeStyles(p), [p]);

  const { dayCount, exerciseCount } = getPlanTotals(plan);

  return (
    <Animated.View
      entering={FadeInDown.delay(40).duration(420)}
      style={styles.masthead}
    >
      <Text style={styles.eyebrow}>Training Plan</Text>
      <Text style={styles.title}>{plan.name}</Text>

      <View style={styles.statRow}>
        <View style={styles.metaItem}>
          <Ionicons name="calendar-outline" size={13} color={p.muted} />
          <Text style={styles.statText}>
            {dayCount} day{dayCount !== 1 ? "s" : ""}
          </Text>
        </View>
        <View style={styles.metaDot} />
        <View style={styles.metaItem}>
          <Ionicons name="barbell-outline" size={13} color={p.muted} />
          <Text style={styles.statText}>
            {exerciseCount} exercise{exerciseCount !== 1 ? "s" : ""}
          </Text>
        </View>
      </View>

      <Pressable
        onPress={onToggleActive}
        style={[styles.activeToggle, isActive && styles.activeToggleOn]}
      >
        {isActive && (
          <Ionicons name="checkmark-circle" size={14} color={p.accent} />
        )}
        <Text style={[styles.activeText, isActive && styles.activeTextOn]}>
          {isActive ? "Active Plan" : "Set as Active"}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

const makeStyles = (p: Palette) =>
  StyleSheet.create({
    masthead: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 18 },
    eyebrow: {
      color: p.accent,
      fontSize: 10,
      fontFamily: FontFamilies.medium,
      letterSpacing: 3,
      textTransform: "uppercase",
      marginBottom: 8,
    },
    title: {
      color: p.bone,
      fontSize: 34,
      fontFamily: FontFamilies.displayLight,
      letterSpacing: -0.8,
      lineHeight: 38,
    },
    statRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      marginTop: 14,
    },
    statText: {
      color: p.muted,
      fontSize: 12.5,
      fontFamily: FontFamilies.regular,
      letterSpacing: 0.2,
    },
    metaItem: { flexDirection: "row", alignItems: "center", gap: 5 },
    metaDot: {
      width: 3,
      height: 3,
      borderRadius: 1.5,
      backgroundColor: p.mutedSoft,
    },
    activeToggle: {
      alignSelf: "flex-start",
      marginTop: 16,
      height: 36,
      paddingHorizontal: 14,
      borderRadius: 12,
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      backgroundColor: p.inkRaised,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: p.hairlineStrong,
    },
    activeToggleOn: {
      backgroundColor: p.accentSoft,
      borderColor: p.accentBorder,
    },
    activeText: {
      color: p.muted,
      fontSize: 11,
      fontFamily: FontFamilies.medium,
      letterSpacing: 1.6,
      textTransform: "uppercase",
    },
    activeTextOn: { color: p.accent },
  });
