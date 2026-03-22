import { ThemedText } from "@/components/ThemedText";
import Button from "@/components/ui/Button";
import { useWorkoutContext } from "@/src/features/workouts/hooks/useWorkoutPlanContext";
import React from "react";
import { Modal, TextInput, TouchableOpacity, View } from "react-native";
import { ThemedView } from "@/components/ThemedView";

interface WorkoutLogOverlayProps {
  visible: boolean;

  totalSets: number;
  exerciseName: string;
  disabled?: boolean;
  setShowWorkoutLog: (show: boolean) => void;
  setShowRestTimer: (show: boolean) => void;
  setIsRestTimerActive: (active: boolean) => void;
  currentWeight: string;
  setCurrentWeight: (weight: string) => void;
  currentReps: string;
  setCurrentReps: (reps: string) => void;
  handleSaveWorkoutLog: () => void;
  handleCloseWorkoutLog: () => void;
  addFinishedWorkout: (workoutId: number) => void;
  selectedExcerciseID: number;
  loadFinishedWorkouts: () => void;
}

export default function WorkoutLogOverlay({
  visible,
  totalSets,
  exerciseName,
  disabled = false,
  setShowWorkoutLog,
  setShowRestTimer,
  setIsRestTimerActive,
  currentWeight,
  setCurrentWeight,
  currentReps,
  setCurrentReps,
  handleSaveWorkoutLog,
  handleCloseWorkoutLog,
  addFinishedWorkout,
  selectedExcerciseID,
  loadFinishedWorkouts,
}: WorkoutLogOverlayProps) {
  const { currentSet, workoutLog, finishedWorkouts, currentWorkout } =
    useWorkoutContext();

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={() => {
        setShowWorkoutLog(false);
        handleCloseWorkoutLog();
      }}
    >
      <View className="flex-1 bg-black/50 justify-center items-center">
        <ThemedView className="bg-lightDark rounded-2xl p-6 mx-4 w-full max-w-sm">
          <TouchableOpacity
            onPress={() => {
              handleCloseWorkoutLog();
              setShowWorkoutLog(false);
            }}
            className="absolute top-4 right-4 z-10"
          >
            <ThemedText className="text-whiteText text-2xl font-bold">
              ×
            </ThemedText>
          </TouchableOpacity>

          <ThemedText className="text-whiteText text-xl font-bold text-center mb-6">
            Log Your Set
          </ThemedText>

          <ThemedText className="text-whiteText text-lg mb-4">
            {exerciseName}
          </ThemedText>

          <ThemedText className="text-mutedText mb-4">
            Set {currentSet > totalSets ? totalSets : currentSet} of {totalSets}
          </ThemedText>

          {/* Weight Input */}
          <View className="mb-4">
            <ThemedText className="text-whiteText mb-2">Weight (lb)</ThemedText>
            <TextInput
              value={currentWeight}
              onChangeText={setCurrentWeight}
              placeholder="Enter weight"
              placeholderTextColor="#6B7280"
              className="bg-important rounded-lg p-3 text-whiteText"
              keyboardType="numeric"
            />
          </View>

          {/* Reps Input */}
          <View className="mb-6">
            <ThemedText className="text-whiteText mb-2">Reps</ThemedText>
            <TextInput
              value={currentReps}
              onChangeText={setCurrentReps}
              placeholder="Enter reps"
              placeholderTextColor="#6B7280"
              className="bg-important rounded-lg p-3 text-whiteText"
              keyboardType="numeric"
            />
          </View>

          {/* Previous Sets Log */}
          {workoutLog.length > 0 && (
            <View className="mb-4">
              <ThemedText className="text-whiteText mb-2">
                Previous Sets:
              </ThemedText>
              {workoutLog.map((set, index) => (
                <View
                  key={index}
                  className="flex-row justify-between bg-important rounded-lg p-2 mb-1"
                >
                  <ThemedText className="text-whiteText">
                    Set {index + 1}
                  </ThemedText>
                  <ThemedText className="text-whiteText">
                    {set.weight}lb × {set.reps} reps
                  </ThemedText>
                </View>
              ))}
            </View>
          )}

          <Button
            buttonText={
              currentSet === totalSets ? "Finish Workout" : "Save Set"
            }
            onPress={() => {
              if (currentSet === totalSets) {
                addFinishedWorkout(selectedExcerciseID);
                console.log("finishedWorkouts", finishedWorkouts.length);
                console.log(
                  "currentWorkout",
                  currentWorkout.workouts_per_day.length
                );
                if (
                  finishedWorkouts.length ===
                  currentWorkout.workouts_per_day.length
                ) {
                }
              }
              handleSaveWorkoutLog();
              setShowWorkoutLog(false);
              setShowRestTimer(true);
              setIsRestTimerActive(true);
            }}
            disabled={disabled || !currentWeight || !currentReps}
            className=""
          />
        </ThemedView>
      </View>
    </Modal>
  );
}
