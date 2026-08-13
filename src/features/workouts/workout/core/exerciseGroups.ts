import type { Exercise } from "../../types";

export type MuscleGroup = {
  muscle: string;
  title: string;
  baseIndex: number;
  items: Exercise[];
};

export type GroupedExercises = {
  groups: MuscleGroup[];
  showHeaders: boolean;
};

function titleCase(value: string) {
  return value.replace(/\b\w/g, (c) => c.toUpperCase());
}

// Group exercises by muscle group, ordered by first appearance (position-sorted).
// baseIndex is the group's offset into the flat, position-sorted list so rows
// keep their overall numbering across groups.
export function groupExercisesByMuscle(
  exercises: Exercise[]
): GroupedExercises {
  const sorted = [...exercises].sort((a, b) => a.position - b.position);
  const groups: MuscleGroup[] = [];

  for (const exercise of sorted) {
    const muscle = exercise.muscleGroup?.trim() || "Other";
    const existing = groups.find(
      (g) => g.muscle.toLowerCase() === muscle.toLowerCase()
    );
    if (existing) existing.items.push(exercise);
    else
      groups.push({
        muscle,
        title: titleCase(muscle),
        baseIndex: 0,
        items: [exercise],
      });
  }

  let offset = 0;
  for (const group of groups) {
    group.baseIndex = offset;
    offset += group.items.length;
  }

  return {
    groups,
    showHeaders: groups.length > 1 || groups[0]?.muscle !== "Other",
  };
}
