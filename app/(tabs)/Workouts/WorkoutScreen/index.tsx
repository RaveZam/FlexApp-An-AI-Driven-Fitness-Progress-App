import { ThemedView } from "@/components/ThemedView";
import Button from "@/components/ui/Button";
import ExercisesModal from "@/components/ui/ExercisesModal";
import RestTimerOverlay from "@/components/ui/RestTimerOverlay";
import WorkoutLogOverlay from "@/components/ui/WorkoutLogOverlay";
import WorkoutScreenHeader from "@/components/WorkoutScreenComponents/WorkoutScreenHeader";
import WorkoutSets from "@/components/WorkoutScreenComponents/WorkoutSetsComopnents/WorkoutSets";
import WorkoutTimers from "@/components/WorkoutScreenComponents/WorkoutTimers";
import { useFetchWorkoutPlans } from "@/hooks/useFetchWorkoutPlans";
import { useWorkoutContext } from "@/hooks/useWorkoutPlanContext";
import { useWorkoutSessionTimer } from "@/hooks/WorkoutHooks/useWorkoutSessionTimer";
import { useRestTimer } from "@/hooks/WorkoutScreenHooks/useRestTimer";
import { useSelectedWorkoutCard } from "@/hooks/WorkoutScreenHooks/useSelectedWorkoutCard";
import { useWorkoutLogs } from "@/hooks/WorkoutScreenHooks/useWorkoutLogs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function index() {
  useFetchWorkoutPlans();
  const { currentWorkout } = useWorkoutContext();
  const [showExercisesModal, setShowExercisesModal] = useState(false);

  const [showWorkoutLog, setShowWorkoutLog] = useState(false);

  const { time, formatTime, startTimer, loadStartTime, stopTimer } =
    useWorkoutSessionTimer();
  const {
    activeWorkoutSession,
    finishedWorkouts,
    currentSessionStatus,
    setCurrentSet,
  } = useWorkoutContext();

  useEffect(() => {
    if (currentSessionStatus === "completed") {
      stopTimer();
    }
  }, [currentSessionStatus]);

  const {
    showRestTimer,
    setShowRestTimer,
    setIsRestTimerActive,
    restTime,
    handleStartNextSet,
  } = useRestTimer();

  const {
    handleCloseWorkoutLog,
    currentWeight,
    setCurrentWeight,
    currentReps,
    setCurrentReps,
    handleSaveWorkoutLog,
    addFinishedWorkout,
    loadFinishedWorkouts,
  } = useWorkoutLogs();

  const { displayExercise, selectedExercise, setSelectedExercise } =
    useSelectedWorkoutCard();

  useEffect(() => {
    const loadPreviousTimer = async () => {
      const previousTimer = await loadStartTime();
      if (!previousTimer) {
        startTimer();
      }
    };
    loadPreviousTimer();
  }, [activeWorkoutSession]);

  console.log;

  const isFinished = finishedWorkouts.includes(displayExercise?.workout_id?.id);

  return (
    <SafeAreaView className="flex-1">
      <ThemedView className="flex-1">
        <WorkoutScreenHeader setShowExercisesModal={setShowExercisesModal} />

        <WorkoutTimers formatTime={formatTime} time={time} />

        <WorkoutSets
          isFinished={isFinished}
          selectedExercise={selectedExercise}
        />

        <Button
          className="z-20"
          buttonText="Clear Workouts"
          onPress={() => {
            AsyncStorage.removeItem("startDate");
            AsyncStorage.removeItem("workoutSession");
            AsyncStorage.removeItem("finishedWorkouts");
            setShowRestTimer(false);
            setIsRestTimerActive(false);
            setCurrentSet(1);
            stopTimer();
          }}
        />
        <Button
          className="z-20"
          buttonText={isFinished ? "Workout Finished" : "Start Workout"}
          disabled={isFinished}
          onPress={() => setShowWorkoutLog(true)}
        />

        {/* Workout Log Overlay */}
        <WorkoutLogOverlay
          visible={showWorkoutLog}
          totalSets={displayExercise?.sets || 3}
          exerciseName={displayExercise?.workout_id?.workout_name || "Exercise"}
          setShowWorkoutLog={setShowWorkoutLog}
          setShowRestTimer={setShowRestTimer}
          setIsRestTimerActive={setIsRestTimerActive}
          currentWeight={currentWeight}
          setCurrentWeight={setCurrentWeight}
          currentReps={currentReps}
          setCurrentReps={setCurrentReps}
          handleSaveWorkoutLog={handleSaveWorkoutLog}
          handleCloseWorkoutLog={handleCloseWorkoutLog}
          addFinishedWorkout={addFinishedWorkout}
          selectedExcerciseID={displayExercise?.workout_id?.id}
          loadFinishedWorkouts={loadFinishedWorkouts}
        />

        {/* Rest Timer Overlay */}
        <RestTimerOverlay
          isFinished={isFinished}
          visible={showRestTimer}
          exerciseName={displayExercise?.workout_id?.workout_name || "Exercise"}
          restTime={restTime}
          onClose={() => setShowRestTimer(false)}
          handleStartNextSet={() => {
            if (isFinished) {
              setShowWorkoutLog(false);
              setShowRestTimer(false);
              setIsRestTimerActive(false);
              return;
            }
            handleStartNextSet();
            setShowWorkoutLog(true);
          }}
        />

        {/* Exercises Modal */}
        <ExercisesModal
          isVisible={showExercisesModal}
          onClose={() => setShowExercisesModal(false)}
          exercises={currentWorkout?.workouts_per_day || []}
          onSelect={(exercise: any) => setSelectedExercise(exercise)}
          selectedExercise={selectedExercise}
        />
      </ThemedView>
    </SafeAreaView>
  );
}
