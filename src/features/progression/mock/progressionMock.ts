import type { ProgressionExercise } from "../types";

// Dates walk backward from "today" in ~3-4 day increments, oldest first —
// matches the chronological order ExerciseSessionPoint arrives in from the DAO.
function datesBack(count: number, stepDays = 3.5): string[] {
  const out: string[] = [];
  const now = new Date("2026-07-26T09:00:00Z");
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(now.getTime() - i * stepDays * 24 * 60 * 60 * 1000);
    out.push(d.toISOString());
  }
  return out;
}

function series(
  weights: number[],
  reps: number[],
  id: string,
): ProgressionExercise["points"] {
  const dates = datesBack(weights.length);
  return weights.map((maxWeight, i) => ({
    sessionId: `${id}-s${i}`,
    startedAt: dates[i],
    maxWeight,
    repsAtMax: reps[i],
  }));
}

export const progressionMock: ProgressionExercise[] = [
  {
    id: "back-squat",
    name: "Back Squat",
    muscleGroup: "Legs",
    isUnilateral: false,
    points: series(
      [225, 235, 235, 245, 255, 260, 275],
      [5, 5, 6, 5, 5, 5, 5],
      "squat",
    ),
    best: { weight: 275, reps: 5, date: "2026-07-23T09:00:00Z" },
  },
  {
    id: "bench-press",
    name: "Bench Press",
    muscleGroup: "Chest",
    isUnilateral: false,
    points: series(
      [175, 180, 185, 185, 185, 185, 185],
      [5, 5, 5, 5, 4, 5, 4],
      "bench",
    ),
    best: { weight: 185, reps: 5, date: "2026-07-09T09:00:00Z" },
  },
  {
    id: "deadlift",
    name: "Deadlift",
    muscleGroup: "Back",
    isUnilateral: false,
    points: series(
      [275, 285, 295, 295, 315, 315, 335],
      [5, 5, 5, 6, 5, 6, 5],
      "deadlift",
    ),
    best: { weight: 335, reps: 5, date: "2026-07-23T09:00:00Z" },
  },
  {
    id: "overhead-press",
    name: "Overhead Press",
    muscleGroup: "Shoulders",
    isUnilateral: false,
    points: series(
      [95, 100, 105, 105, 105, 100, 105],
      [5, 5, 4, 5, 4, 5, 4],
      "ohp",
    ),
    best: { weight: 105, reps: 5, date: "2026-06-25T09:00:00Z" },
  },
  {
    id: "barbell-row",
    name: "Barbell Row",
    muscleGroup: "Back",
    isUnilateral: false,
    points: series(
      [135, 145, 145, 155, 155, 165, 170],
      [6, 6, 8, 6, 7, 6, 6],
      "row",
    ),
    best: { weight: 170, reps: 6, date: "2026-07-23T09:00:00Z" },
  },
  {
    id: "dumbbell-lunge",
    name: "Dumbbell Lunge",
    muscleGroup: "Legs",
    isUnilateral: true,
    points: series(
      [40, 40, 45, 45, 50, 50, 50],
      [10, 12, 10, 11, 10, 10, 9],
      "lunge",
    ),
    best: { weight: 50, reps: 10, date: "2026-07-16T09:00:00Z" },
  },
];

export function getProgressionExercise(id: string): ProgressionExercise | undefined {
  return progressionMock.find((e) => e.id === id);
}
