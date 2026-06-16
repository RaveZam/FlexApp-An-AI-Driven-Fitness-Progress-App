import { useExerciseHistory } from "@/src/features/workouts/session/hooks/useExerciseHistory";
import { useSessionGuard } from "@/src/features/workouts/session/hooks/useSessionGuard";
import { cancelSession, completeSession, getSessionById, updateSet } from "@/src/features/workouts/session/services/sessionLocalService";
import type { SessionExerciseView } from "@/src/features/workouts/session/sessionView";
import type { WorkoutSession } from "@/src/features/workouts/types";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";
import { useActiveSession } from "../../context/ActivePlanContext";
import { getBottomMode, getCompletedSetCount, getEditingSet, getProgressPct } from "../core/workoutSession";

function sessionToView(session: WorkoutSession): SessionExerciseView[] {
  return session.exercises.map((ex) => ({
    id: ex.id,
    name: ex.name,
    isUnilateral: ex.isUnilateral,
    sets: ex.sets.map((s) => ({
      id: s.id,
      setNumber: s.setIndex + 1,
      targetReps: s.targetReps,
      weight: s.weight,
      actualReps: s.actualReps,
      actualRepsLeft: s.actualRepsLeft,
      actualRepsRight: s.actualRepsRight,
      completed: s.completed,
    })),
  }));
}

export function useWorkoutSession(
  sessionId: string | undefined,
  opts?: { onRestNeeded?: () => void }
) {
  const { refresh: refreshActiveSession } = useActiveSession();

  const [name, setName] = useState("Today's Workout");
  const [exercises, setExercises] = useState<SessionExerciseView[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useSessionGuard(sessionId);

  const [showLogModal, setShowLogModal] = useState(false);
  const [editingSetId, setEditingSetId] = useState<string | null>(null);

  useEffect(() => {
    const session = sessionId ? getSessionById(sessionId) : null;
    setName(session?.name ?? "Today's Workout");
    setExercises(session ? sessionToView(session) : []);
    setActiveIndex(0);
    setLoading(false);
  }, [sessionId]);

  const active = exercises[activeIndex];
  const currentSetIndex = active?.sets.findIndex((s) => !s.completed) ?? -1;
  const allSetsComplete = active ? currentSetIndex === -1 : true;
  const allExercisesComplete = exercises.every((ex) => ex.sets.every((s) => s.completed));

  const editingSet = getEditingSet(editingSetId, active);

  const { best, recentSessions } = useExerciseHistory(active?.name, getCompletedSetCount(exercises));

  useEffect(() => {
    if (!loading && !active) router.back();
  }, [loading, active]);

  const logSet = useCallback(
    (
      weight: number,
      actualReps: number | null,
      leftReps: number | null,
      rightReps: number | null
    ) => {
      if (currentSetIndex === -1 || !active) return;
      const setId = active.sets[currentSetIndex].id;
      setExercises((prev) => {
        const updated = [...prev];
        const ex = { ...updated[activeIndex] };
        const sets = [...ex.sets];
        sets[currentSetIndex] = {
          ...sets[currentSetIndex],
          weight,
          actualReps,
          actualRepsLeft: leftReps,
          actualRepsRight: rightReps,
          completed: true,
        };
        ex.sets = sets;
        updated[activeIndex] = ex;
        return updated;
      });
      if (sessionId) {
        updateSet(setId, {
          actualReps,
          actualRepsLeft: leftReps,
          actualRepsRight: rightReps,
          weight,
          completed: true,
        });
      }
    },
    [active, activeIndex, currentSetIndex, sessionId]
  );

  const editSet = useCallback(
    (
      setId: string,
      weight: number,
      actualReps: number | null,
      leftReps: number | null,
      rightReps: number | null
    ) => {
      setExercises((prev) =>
        prev.map((ex) => ({
          ...ex,
          sets: ex.sets.map((s) =>
            s.id === setId
              ? {
                  ...s,
                  weight,
                  actualReps,
                  actualRepsLeft: leftReps,
                  actualRepsRight: rightReps,
                  completed: true,
                }
              : s
          ),
        }))
      )
      if (sessionId) {
        updateSet(setId, {
          actualReps,
          actualRepsLeft: leftReps,
          actualRepsRight: rightReps,
          weight,
          completed: true,
        });
      }
    },
    [sessionId]
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

  function handleLog(
    weight: number,
    actualReps: number | null,
    leftReps: number | null,
    rightReps: number | null
  ) {
    const incomplete = exercises.reduce(
      (acc, ex) => acc + ex.sets.filter((s) => !s.completed).length,
      0
    );
    const isLastSet = incomplete === 1;
    logSet(weight, actualReps, leftReps, rightReps);
    setShowLogModal(false);
    if (!isLastSet) opts?.onRestNeeded?.();
  }

  function handleEditSave(
    weight: number,
    actualReps: number | null,
    leftReps: number | null,
    rightReps: number | null
  ) {
    if (!editingSetId) return;
    editSet(editingSetId, weight, actualReps, leftReps, rightReps);
    setEditingSetId(null);
  }

  function handleExit() {
    Alert.alert("Cancel Workout?", "Your progress will not be saved.", [
      { text: "Keep Going", style: "cancel" },
      {
        text: "Cancel Workout",
        style: "destructive",
        onPress: () => {
          if (sessionId) cancelSession(sessionId);
          refreshActiveSession();
          router.back();
        },
      },
    ]);
  }

  function handleFinish() {
    if (sessionId) completeSession(sessionId);
    refreshActiveSession();
    router.back();
  }

  const bottomMode = getBottomMode(allExercisesComplete, allSetsComplete);

  const bottomAction =
    bottomMode === "finish"
      ? handleFinish
      : bottomMode === "next"
      ? goToNextExercise
      : () => setShowLogModal(true);

  const progressPct = getProgressPct(exercises, activeIndex, allSetsComplete);

  return {
    loading,
    name,
    active,
    exercises,
    activeIndex,
    currentSetIndex,
    allSetsComplete,
    allExercisesComplete,
    best,
    recentSessions,
    progressPct,
    bottomMode,
    bottomAction,
    editingSet,
    showLogModal,
    handleLog,
    handleEditSave,
    handleExit,
    goToExercise: (index: number) => setActiveIndex(index),
    openEditSet: (id: string) => setEditingSetId(id),
    closeEditSet: () => setEditingSetId(null),
    closeLogModal: () => setShowLogModal(false),
  };
}
