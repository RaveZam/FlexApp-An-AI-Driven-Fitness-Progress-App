import { FontFamilies } from "@/constants/theme";
import { usePalette, type Palette } from "@/src/theme";
import { Feather } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useProgressiveOverload } from "../../hooks/ProgressiveOverload/useProgressiveOverload";
import { ExerciseCard } from "./ExerciseCard";

export function ProgressiveOverload() {
  const p = usePalette();
  const styles = useMemo(() => makeStyles(p), [p]);
  const [bodyFilter, setBodyFilter] = useState("");
  const { exercises, muscleGroups, selectedGroup } =
    useProgressiveOverload(bodyFilter);

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Progress</Text>
        <Text style={styles.window}>Last 7 sessions</Text>
      </View>

      {muscleGroups.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipRow}
        >
          {muscleGroups.map((chip) => {
            const active = chip === selectedGroup;
            return (
              <Pressable
                key={chip}
                hitSlop={6}
                onPress={() => setBodyFilter(chip)}
                style={[styles.chip, active && styles.chipActive]}
              >
                {active && <View style={styles.chipDot} />}
                <Text
                  style={[styles.chipText, active && styles.chipTextActive]}
                >
                  {chip}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      )}

      {exercises.length === 0 ? (
        <View style={styles.empty}>
          <Feather name="inbox" size={14} color={p.muted} />
          <Text style={styles.emptyText}>No logged workouts yet</Text>
        </View>
      ) : (
        exercises.map((exercise, i) => (
          <ExerciseCard
            key={exercise.name}
            exercise={exercise}
            delay={i * 70}
          />
        ))
      )}
    </View>
  );
}

const makeStyles = (p: Palette) =>
  StyleSheet.create({
    section: { marginHorizontal: 20, marginTop: 24, gap: 12 },
    header: {
      flexDirection: "row",
      alignItems: "baseline",
      justifyContent: "space-between",
    },
    title: {
      color: p.bone,
      fontSize: 22,
      fontFamily: FontFamilies.displayMedium,
      letterSpacing: -0.5,
    },
    window: {
      color: p.muted,
      fontSize: 9,
      fontFamily: FontFamilies.medium,
      letterSpacing: 1.6,
      textTransform: "uppercase",
    },
    chipRow: { gap: 8, paddingVertical: 2, paddingRight: 4 },
    chip: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingVertical: 6,
      paddingHorizontal: 13,
      borderRadius: 999,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: p.hairline,
      // Faint bone-tinted fill, nearest fit is the hairline token (same rgba family).
      backgroundColor: p.hairline,
    },
    chipActive: {
      borderColor: p.accentBorder,
      backgroundColor: p.accentSoft,
    },
    chipDot: {
      width: 5,
      height: 5,
      borderRadius: 2.5,
      backgroundColor: p.accent,
    },
    chipText: {
      color: p.muted,
      fontSize: 11,
      fontFamily: FontFamilies.medium,
      letterSpacing: 0.4,
      textTransform: "capitalize",
    },
    chipTextActive: { color: p.accent, fontFamily: FontFamilies.semibold },
    empty: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 32,
      gap: 8,
    },
    emptyText: {
      color: p.muted,
      fontSize: 11,
      fontFamily: FontFamilies.regular,
      letterSpacing: 0.4,
    },
  });
