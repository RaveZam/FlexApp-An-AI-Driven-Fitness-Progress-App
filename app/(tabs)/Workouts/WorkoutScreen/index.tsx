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
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function index() {
  useFetchWorkoutPlans();
  const { currentWorkout } = useWorkoutContext();
  const [showExercisesModal, setShowExercisesModal] = useState(false);

  const [showWorkoutLog, setShowWorkoutLog] = useState(false);

  const { time, formatTime, startTimer, loadStartTime } =
    useWorkoutSessionTimer();
  const { activeWorkoutSession } = useWorkoutContext();

  const {
    showRestTimer,
    setShowRestTimer,
    setIsRestTimerActive,
    restTime,
    handleStartNextSet,
  } = useRestTimer();

  const {
    currentSet,
    workoutLog,
    handleCloseWorkoutLog,
    currentWeight,
    setCurrentWeight,
    currentReps,
    setCurrentReps,
    handleSaveWorkoutLog,
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

  return (
    <SafeAreaView className="flex-1">
      <ThemedView className="flex-1">
        <WorkoutScreenHeader setShowExercisesModal={setShowExercisesModal} />

        <WorkoutTimers formatTime={formatTime} time={time} />

        <WorkoutSets
          workoutLog={workoutLog}
          currentSet={currentSet}
          selectedExercise={selectedExercise}
        />

        <Button
          className="z-20"
          buttonText="Start Workout"
          onPress={() => setShowWorkoutLog(true)}
        />

        {/* Workout Log Overlay */}
        <WorkoutLogOverlay
          visible={showWorkoutLog}
          currentSet={currentSet}
          totalSets={displayExercise?.sets || 3}
          exerciseName={displayExercise?.workout_id?.workout_name || "Exercise"}
          workoutLog={workoutLog}
          setShowWorkoutLog={setShowWorkoutLog}
          setShowRestTimer={setShowRestTimer}
          setIsRestTimerActive={setIsRestTimerActive}
          currentWeight={currentWeight}
          setCurrentWeight={setCurrentWeight}
          currentReps={currentReps}
          setCurrentReps={setCurrentReps}
          handleSaveWorkoutLog={handleSaveWorkoutLog}
          handleCloseWorkoutLog={handleCloseWorkoutLog}
        />

        {/* Rest Timer Overlay */}
        <RestTimerOverlay
          visible={showRestTimer}
          exerciseName={displayExercise?.workout_id?.workout_name || "Exercise"}
          restTime={restTime}
          onClose={() => setShowRestTimer(false)}
          handleStartNextSet={() => {
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
