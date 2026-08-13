import { FontFamilies } from "@/constants/theme";
import { usePalette, type Palette } from "@/src/theme";
import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import type { MuscleGroup } from "../core/exerciseGroups";
import { ExerciseRow } from "./ExerciseRow";

type Props = {
  group: MuscleGroup;
  showHeader: boolean;
  editing: boolean;
  selectedIds: Set<string>;
  onToggle: (exerciseId: string) => void;
  onUpdateTargets: (exerciseId: string, sets: number, reps: number) => void;
};

export function ExerciseMuscleGroup({
  group,
  showHeader,
  editing,
  selectedIds,
  onToggle,
  onUpdateTargets,
}: Props) {
  const p = usePalette();
  const styles = useMemo(() => makeStyles(p), [p]);

  return (
    <View style={styles.group}>
      {showHeader && (
        <View style={styles.header}>
          <Text style={styles.title}>{group.title}</Text>
          <View style={styles.line} />
          <Text style={styles.count}>{group.items.length}</Text>
        </View>
      )}

      <View style={styles.list}>
        {group.items.map((exercise, index) => (
          <ExerciseRow
            key={exercise.id}
            exercise={exercise}
            index={group.baseIndex + index}
            editing={editing}
            selected={selectedIds.has(exercise.id)}
            onToggle={() => onToggle(exercise.id)}
            onUpdateTargets={(sets, reps) =>
              onUpdateTargets(exercise.id, sets, reps)
            }
          />
        ))}
      </View>
    </View>
  );
}

const makeStyles = (p: Palette) =>
  StyleSheet.create({
    group: { gap: 11 },
    header: { flexDirection: "row", alignItems: "center", gap: 12 },
    title: {
      color: p.muted,
      fontSize: 10,
      fontFamily: FontFamilies.medium,
      letterSpacing: 2.4,
      textTransform: "uppercase",
    },
    line: {
      flex: 1,
      height: StyleSheet.hairlineWidth,
      backgroundColor: p.hairline,
    },
    count: {
      color: p.mutedSoft,
      fontSize: 11,
      fontFamily: FontFamilies.regular,
    },
    list: { gap: 8 },
  });
