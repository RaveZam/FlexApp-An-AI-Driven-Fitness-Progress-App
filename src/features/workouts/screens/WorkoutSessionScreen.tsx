import { ThemedView } from "@/components/ThemedView";
import Button from "@/components/ui/Button";
import ExercisesModal from "@/src/features/workouts/components/ExercisesModal";
import RestTimerOverlay from "@/src/features/workouts/components/workout-screen/RestTimerOverlay";
import WorkoutLogOverlay from "@/src/features/workouts/components/workout-screen/WorkoutLogOverlay";
import WorkoutScreenHeader from "@/src/features/workouts/components/workout-screen/WorkoutScreenHeader";
import WorkoutSets from "@/src/features/workouts/components/workout-screen/WorkoutSets";
import WorkoutTimers from "@/src/features/workouts/components/workout-screen/WorkoutTimers";
import { useFetchWorkoutPlans } from "@/src/features/workouts/hooks/useFetchWorkoutPlans";
import { useWorkoutContext } from "@/src/features/workouts/hooks/useWorkoutPlanContext";
import { useWorkoutSessionTimer } from "@/src/features/workouts/hooks/useWorkoutSessionTimer";
import { useRestTimer } from "@/src/features/workouts/hooks/useRestTimer";
import { useSelectedWorkoutCard } from "@/src/features/workouts/hooks/useSelectedWorkoutCard";
import { useWorkoutLogs } from "@/src/features/workouts/hooks/useWorkoutLogs";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function WorkoutSessionScreen() {
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

  const isFinished = finishedWorkouts.includes(displayExercise?.workout_id?.id);

  return (
    <SafeAreaView className="flex-1" edges={["top"]}>
      <ThemedView colorToken={"background"} className="flex-1">
        <WorkoutScreenHeader setShowExercisesModal={setShowExercisesModal} />

        <WorkoutTimers formatTime={formatTime} time={time} />

        <WorkoutSets
          isFinished={isFinished}
          selectedExercise={selectedExercise}
        />

        <Button
          className="z-20 m-4"
          buttonText={isFinished ? "Workout Finished" : "Start Workout"}
          disabled={isFinished}
          icon={
            isFinished ? (
              <Ionicons name="checkmark" size={24} color="white" />
            ) : (
              <Ionicons name="play-circle" size={24} color="white" />
            )
          }
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
