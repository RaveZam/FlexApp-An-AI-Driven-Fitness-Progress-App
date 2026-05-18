import { completeSession, getSessionById, updateSet } from "@/src/features/workouts/services/sessionLocalService";
import type { WorkoutSession } from "@/src/features/workouts/types";
import type { SessionExerciseView } from "@/src/features/workouts/types/sessionView";
import { useCallback, useEffect, useRef, useState } from "react";

function sessionToView(session: WorkoutSession): SessionExerciseView[] {
  return session.exercises.map((ex) => ({
    id: ex.id,
    name: ex.name,
    restSeconds: 90,
    sets: ex.sets.map((s) => ({
      id: s.id,
      setNumber: s.setIndex + 1,
      targetReps: s.targetReps,
      weight: s.weight,
      actualReps: s.actualReps,
      completed: s.completed,
    })),
  }));
}

export function useWorkoutSession(sessionId: string | undefined) {
  const session = sessionId ? getSessionById(sessionId) : null;

  const [name] = useState(session?.name ?? "Today's Workout");
  const [exercises, setExercises] = useState<SessionExerciseView[]>(
    session ? sessionToView(session) : []
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => setElapsedSeconds((s) => s + 1), 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const active = exercises[activeIndex];
  const currentSetIndex = active?.sets.findIndex((s) => !s.completed) ?? -1;
  const allSetsComplete = active ? currentSetIndex === -1 : true;
  const allExercisesComplete = exercises.every((ex) => ex.sets.every((s) => s.completed));

  const logSet = useCallback(
    (weight: number, reps: number) => {
      if (currentSetIndex === -1 || !active) return;
      const setId = active.sets[currentSetIndex].id;
      setExercises((prev) => {
        const updated = [...prev];
        const ex = { ...updated[activeIndex] };
        const sets = [...ex.sets];
        sets[currentSetIndex] = { ...sets[currentSetIndex], weight, actualReps: reps, completed: true };
        ex.sets = sets;
        updated[activeIndex] = ex;
        return updated;
      });
      if (sessionId) {
        updateSet(setId, { actualReps: reps, weight, completed: true });
      }
    },
    [active, activeIndex, currentSetIndex, sessionId]
  );

  const goToNextExercise = useCallback(() => {
    const nextIncomplete = exercises.findIndex(
      (ex, i) => i > activeIndex && !ex.sets.every((s) => s.completed)
    );
    if (nextIncomplete !== -1) {
      setActiveIndex(nextIncomplete);
      return;
    }
    const first = exercises.findIndex((ex) => !ex.sets.every((s) => s.completed));
    if (first !== -1) setActiveIndex(first);
  }, [exercises, activeIndex]);

  const finish = useCallback(() => {
    if (sessionId) completeSession(sessionId);
  }, [sessionId]);

  return {
    name,
    exercises,
    activeIndex,
    setActiveIndex,
    active,
    currentSetIndex,
    allSetsComplete,
    allExercisesComplete,
    elapsedSeconds,
    logSet,
    goToNextExercise,
    finish,
  };
}
