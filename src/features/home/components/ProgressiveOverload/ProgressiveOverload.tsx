import { FontFamilies, Palette } from "@/constants/theme";
import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useProgressiveOverload } from "../../hooks/ProgressiveOverload/useProgressiveOverload";
import { ExerciseCard } from "./ExerciseCard";

export function ProgressiveOverload() {
  const [bodyFilter, setBodyFilter] = useState("");
  const { exercises, muscleGroups } = useProgressiveOverload(bodyFilter);

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
            const active = chip === bodyFilter;
            return (
              <Pressable
                key={chip}
                hitSlop={6}
                onPress={() => setBodyFilter(chip)}
                style={[styles.chip, active && styles.chipActive]}
              >
                {active && <View style={styles.chipDot} />}
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{chip}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
      )}

      {exercises.length === 0 ? (
        <View style={styles.empty}>
          <Feather name="inbox" size={14} color={Palette.muted} />
          <Text style={styles.emptyText}>No logged workouts yet</Text>
        </View>
      ) : (
        exercises.map((exercise, i) => (
          <ExerciseCard key={exercise.name} exercise={exercise} delay={i * 70} />
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginHorizontal: 20, marginTop: 24, gap: 12 },
  header: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
  },
  title: {
    color: Palette.bone,
    fontSize: 22,
    fontFamily: FontFamilies.displayMedium,
    letterSpacing: -0.5,
  },
  window: {
    color: Palette.muted,
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
    borderColor: Palette.hairline,
    backgroundColor: "rgba(245,243,239,0.03)",
  },
  chipActive: {
    borderColor: Palette.accentBorder,
    backgroundColor: Palette.accentSoft,
  },
  chipDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: Palette.accent,
  },
  chipText: {
    color: Palette.muted,
    fontSize: 11,
    fontFamily: FontFamilies.medium,
    letterSpacing: 0.4,
    textTransform: "capitalize",
  },
  chipTextActive: { color: Palette.accent, fontFamily: FontFamilies.semibold },
  empty: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 32,
    gap: 8,
  },
  emptyText: {
    color: Palette.muted,
    fontSize: 11,
    fontFamily: FontFamilies.regular,
    letterSpacing: 0.4,
  },
});
