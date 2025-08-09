import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import WorkoutCard from "@/components/Workout/WorkoutCard";
import { useWorkoutContext } from "@/hooks/useWorkoutPlanContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { Modal, ScrollView, TouchableOpacity, View } from "react-native";

interface ExercisesModalProps {
  isVisible: boolean;
  onClose: () => void;
  exercises: any[];
  onSelect?: (exercise: any) => void;
  selectedExercise?: any;
}

export default function ExercisesModal({
  isVisible,
  onClose,
  exercises,
  onSelect,
  selectedExercise,
}: ExercisesModalProps) {
  const { finishedWorkouts } = useWorkoutContext();
  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <ThemedView className="flex-1">
        {/* Header */}
        <View className="flex-row justify-between items-center px-4 py-6 border-b border-important">
          <ThemedText className="text-whiteText text-lg font-medium">
            Today's Exercises
          </ThemedText>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color="#9BA1A6" />
          </TouchableOpacity>
        </View>

        {/* Exercises List */}
        <ScrollView
          className="flex-1 px-4"
          showsVerticalScrollIndicator={false}
        >
          {exercises && exercises.length > 0 ? (
            exercises.map((exercise, index) => {
              const isSelected =
                selectedExercise &&
                selectedExercise.workout_id?.workout_name ===
                  exercise.workout_id?.workout_name;

              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    onSelect?.(exercise);
                    onClose();
                  }}
                  activeOpacity={0.7}
                  className={`mb-2 ${
                    isSelected
                      ? "border-2 border-emerald-500 rounded-lg"
                      : finishedWorkouts.includes(exercise.workout_id?.id)
                      ? "opacity-50"
                      : ""
                  }`}
                >
                  <WorkoutCard
                    workout={
                      exercise.workout_id?.workout_name || "Unknown Exercise"
                    }
                    reps={exercise.reps || "0"}
                    sets={exercise.sets || "0"}
                    rest_time={exercise.rest_time || "0"}
                    workout_image={exercise.workout_id?.workout_image || ""}
                  />
                </TouchableOpacity>
              );
            })
          ) : (
            <View className="flex-1 justify-center items-center mt-20">
              <Ionicons name="fitness-outline" size={64} color="#9BA1A6" />
              <ThemedText className="text-mutedText text-lg mt-4">
                No exercises for today
              </ThemedText>
              <ThemedText className="text-veryMutedText text-sm mt-2 text-center">
                Your workout plan doesn't have any exercises scheduled for
                today.
              </ThemedText>
            </View>
          )}
        </ScrollView>
      </ThemedView>
    </Modal>
  );
}
