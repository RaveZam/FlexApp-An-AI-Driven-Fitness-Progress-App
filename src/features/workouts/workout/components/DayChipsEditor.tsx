import { FontFamilies, Palette } from "@/constants/theme";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { DAY_LABELS } from "../../dayLabels";
import { useUpdateWorkoutDays } from "../hooks/useUpdateWorkoutDays";

export function DayChipsEditor({
  workoutId,
  initialDays,
  onSaved,
}: {
  workoutId: string;
  initialDays: number[];
  onSaved: () => void;
}) {
  const [days, setDays] = useState<number[]>(initialDays);
  const { saveDays } = useUpdateWorkoutDays();

  useEffect(() => {
    setDays(initialDays);
  }, [workoutId]);

  function toggleDay(day: number) {
    const next = days.includes(day) ? days.filter((d) => d !== day) : [...days, day];
    setDays(next);
    saveDays(workoutId, next);
    onSaved();
  }

  return (
    <View>
      <Text style={styles.label}>Schedule</Text>
      <View style={styles.row}>
        {DAY_LABELS.map((label, i) => {
          const selected = days.includes(i);
          return (
            <Pressable
              key={i}
              onPress={() => toggleDay(i)}
              style={[styles.chip, selected && styles.chipOn]}
            >
              <Text style={[styles.chipText, selected && styles.chipTextOn]}>
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    color: Palette.muted,
    fontSize: 10,
    fontFamily: FontFamilies.medium,
    letterSpacing: 2.4,
    textTransform: "uppercase",
    marginBottom: 12,
  },
  row: { flexDirection: "row", gap: 7 },
  chip: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 12,
    backgroundColor: Palette.inkRaised,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Palette.hairline,
  },
  chipOn: {
    backgroundColor: Palette.accentSoft,
    borderColor: Palette.accentBorder,
  },
  chipText: {
    color: Palette.mutedSoft,
    fontSize: 12,
    fontFamily: FontFamilies.medium,
  },
  chipTextOn: {
    color: Palette.accent,
    fontFamily: FontFamilies.semibold,
  },
});
