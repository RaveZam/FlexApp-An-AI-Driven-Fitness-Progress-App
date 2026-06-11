import { useExerciseHistory } from "@/src/features/workouts/session/hooks/useExerciseHistory";
import { useRestTimer } from "@/src/features/workouts/session/hooks/useRestTimer";
import { useSessionGuard } from "@/src/features/workouts/session/hooks/useSessionGuard";
import { useWorkoutSession } from "@/src/features/workouts/session/hooks/useWorkoutSession";
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Alert } from "react-native";
import { useActiveSession } from "../../context/ActivePlanContext";
import { getBottomMode, getCompletedSetCount, getEditingSet, getProgressPct } from "../core/workoutSession";

export function useWorkoutSessionScreen(sessionId: string | undefined) {
  const { refresh: refreshActiveSession } = useActiveSession();

  const {
    loading,
    exercises,
    activeIndex,
    setActiveIndex,
    active,
    currentSetIndex,
    allSetsComplete,
    allExercisesComplete,
    elapsedSeconds,
    logSet,
    editSet,
    goToNextExercise,
    finish,
    cancel,
  } = useWorkoutSession(sessionId);

  useSessionGuard(sessionId);

  const { getUserPreferenceRestTime } = useRestTimer();
  const restSeconds = useMemo(
    () => getUserPreferenceRestTime(),
    [getUserPreferenceRestTime]
  );

  const [showLogModal, setShowLogModal] = useState(false);
  const [showRestTimer, setShowRestTimer] = useState(false);
  const [showExercisesList, setShowExercisesList] = useState(false);
  const [editingSetId, setEditingSetId] = useState<string | null>(null);

  const editingSet = getEditingSet(editingSetId, active);
  
  const { best, recentSessions } = useExerciseHistory(active?.name, getCompletedSetCount(exercises));

  useEffect(() => {
    if (!loading && !active) router.back();
  }, [loading, active]);

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
    if (!isLastSet) setShowRestTimer(true);
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
          cancel();
          refreshActiveSession();
          router.back();
        },
      },
    ]);
  }

  function handleFinish() {
    finish();
    refreshActiveSession();
    router.back();
  }

  function selectExercise(index: number) {
    setActiveIndex(index);
    setShowExercisesList(false);
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
    active,
    exercises,
    activeIndex,
    currentSetIndex,
    allSetsComplete,
    allExercisesComplete,
    elapsedSeconds,
    restSeconds,
    best,
    recentSessions,
    progressPct,
    bottomMode,
    bottomAction,
    editingSet,
    showLogModal,
    showRestTimer,
    showExercisesList,
    handleLog,
    handleEditSave,
    handleExit,
    selectExercise,
    openExercisesList: () => setShowExercisesList(true),
    closeExercisesList: () => setShowExercisesList(false),
    openEditSet: (id: string) => setEditingSetId(id),
    closeEditSet: () => setEditingSetId(null),
    closeLogModal: () => setShowLogModal(false),
    closeRestTimer: () => setShowRestTimer(false),
  };
}
