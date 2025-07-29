import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import Button from "@/components/ui/Button";
import ExercisesModal from "@/components/ui/ExercisesModal";
import LineChart from "@/components/ui/LineChart";
import { useFetchWorkoutPlans } from "@/hooks/useFetchWorkoutPlans";
import { useWorkoutContext } from "@/hooks/useWorkoutPlanContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function index() {
  useFetchWorkoutPlans();
  const { currentWorkout } = useWorkoutContext();
  const router = useRouter();
  const [showExercisesModal, setShowExercisesModal] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<any>(null);

  useEffect(() => {
    if (
      currentWorkout?.workouts_per_day &&
      currentWorkout.workouts_per_day.length > 0
    ) {
      setSelectedExercise(currentWorkout.workouts_per_day[0]);
    }
  }, [currentWorkout]);

  const handleExercisesPress = () => {
    setShowExercisesModal(true);
  };

  const handleCloseExercisesModal = () => {
    setShowExercisesModal(false);
  };

  const handleExerciseSelect = (exercise: any) => {
    setSelectedExercise(exercise);
  };

  const displayExercise =
    selectedExercise ||
    (currentWorkout?.workouts_per_day && currentWorkout.workouts_per_day[0]);

  return (
    <ThemedView className="flex-1">
      <View className="flex-row justify-between items-center ml-12 mx-8 py-8 border-b border-important">
        <TouchableOpacity onPress={() => router.back()}>
          <ThemedText className="text-whiteText">Exit</ThemedText>
        </TouchableOpacity>
        <ThemedText className="text-whiteText font-medium">
          Workout 1/6
        </ThemedText>
        <TouchableOpacity onPress={handleExercisesPress}>
          <ThemedText className="text-whiteText">Exercises</ThemedText>
        </TouchableOpacity>
      </View>

      {/* Timers Section */}
      <View className="flex-row justify-between items-center mx-4 px-4 py-3">
        <View className="items-center">
          <Text className="text-mutedText text-sm">Time</Text>
          <Text className="text-emerald-500 text-lg ">0:03:30</Text>
        </View>
        <View className="items-center">
          <Text className="text-mutedText text-sm">Rest Time</Text>
          <Text className="text-emerald-400 text-lg ">3:00</Text>
        </View>
      </View>

      <ScrollView className="flex-1 " showsVerticalScrollIndicator={false}>
        <View className="bg-lightDark p-4">
          {displayExercise ? (
            <View className="border-2 border-emerald-500 rounded-lg p-4 mb-4 bg-lightDark">
              <View className="flex-row items-center">
                <View className="w-32 h-24 bg-important rounded-lg mr-4 overflow-hidden flex-shrink-0">
                  <Image
                    source={{
                      uri:
                        displayExercise.workout_id?.workout_image ||
                        "https://example.com/incline-dumbbell-press.jpg",
                    }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                </View>
                <View className="flex-1">
                  <ThemedText className="text-whiteText text-lg font-medium">
                    {displayExercise.workout_id?.workout_name ||
                      "Incline Dumbbell Press"}
                  </ThemedText>
                  <ThemedText className="text-mutedText text-sm mt-1">
                    {displayExercise.sets} sets × {displayExercise.reps} reps
                  </ThemedText>
                </View>
              </View>
            </View>
          ) : (
            <View className="border-2 border-emerald-500 rounded-lg p-4 mb-4 bg-lightDark">
              <View className="flex-row items-center">
                <View className="w-24 h-24 bg-important rounded-lg mr-4 overflow-hidden flex-shrink-0">
                  <Image
                    source={{
                      uri: "https://example.com/incline-dumbbell-press.jpg",
                    }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                </View>
                <View className="flex-1">
                  <ThemedText className="text-whiteText text-lg font-medium">
                    Incline Dumbbell Press
                  </ThemedText>
                  <ThemedText className="text-mutedText text-sm mt-1">
                    3 sets × 8-10 reps
                  </ThemedText>
                </View>
              </View>
            </View>
          )}

          {/* Personal Record and History */}
          <View className="flex-row justify-around w-full m-4 ">
            <View>
              <ThemedText className="text-mutedText font-medium text-md mb-2">
                Personal Record:
              </ThemedText>
              <View className="">
                <View className="flex-row gap-1">
                  <Text className="text-sm text-veryMutedText">Weight:</Text>
                  <Text className="text-emerald-500 font-semibold text-sm">
                    50lb
                  </Text>
                </View>
                <View className="flex-row gap-1 ">
                  <Text className="text-sm text-veryMutedText">Reps:</Text>
                  <Text className="text-sm text-emerald-500">9</Text>
                </View>
                <View className="flex-row ">
                  <Text className="text-sm text-mutedText">03/21/2025</Text>
                </View>
              </View>
            </View>

            <View className="flex-1 items-center">
              <ThemedText className="text-mutedText text-sm mb-2">
                History
              </ThemedText>
              <View className="bg-lightDark rounded-lg w-full justify-center items-center">
                <LineChart />
              </View>
            </View>
          </View>
        </View>

        {/* Workout Sets */}
        <View className="m-4">
          <ThemedText className="text-whiteText text-lg font-medium mb-3">
            Sets
          </ThemedText>

          {/* Set 1 */}
          <View className="flex-row items-center bg-lightDark rounded-lg p-3 mb-2">
            <View className="flex-1 flex-row justify-between items-center">
              <ThemedText className="text-whiteText font-medium">
                40lb
              </ThemedText>
              <View className="w-px h-6 bg-important mx-4" />
              <ThemedText className="text-whiteText">3 Reps</ThemedText>
            </View>
            <View className="w-8 h-8 bg-important rounded-full items-center justify-center ml-3">
              <ThemedText className="text-veryMutedText">...</ThemedText>
            </View>
          </View>

          {/* Set 2 */}
          <View className="flex-row items-center bg-lightDark rounded-lg p-3 mb-2">
            <View className="flex-1 flex-row justify-between items-center">
              <ThemedText className="text-whiteText font-medium">
                50lb
              </ThemedText>
              <View className="w-px h-6 bg-important mx-4" />
              <ThemedText className="text-whiteText">9 Reps</ThemedText>
            </View>
            <View className="w-8 h-8 bg-important rounded-full items-center justify-center ml-3">
              <ThemedText className="text-veryMutedText">...</ThemedText>
            </View>
          </View>

          {/* Set 3 - Active/Completed */}
          <View className="flex-row items-center bg-emerald-500 rounded-lg p-3 mb-2">
            <View className="flex-1 flex-row justify-between items-center">
              <ThemedText className="text-white font-medium">50lb</ThemedText>
              <View className="w-px h-6 bg-white mx-4" />
              <ThemedText className="text-white">10 Reps</ThemedText>
            </View>
            <View className="w-8 h-8 bg-white rounded-full items-center justify-center ml-3">
              <Ionicons name="checkmark" size={16} color="#10b981" />
            </View>
          </View>
        </View>
      </ScrollView>

      <Button className="z-20" buttonText="Start Workout" onPress={() => {}} />

      {/* Exercises Modal */}
      <ExercisesModal
        isVisible={showExercisesModal}
        onClose={handleCloseExercisesModal}
        exercises={currentWorkout?.workouts_per_day || []}
        onSelect={handleExerciseSelect}
        selectedExercise={selectedExercise}
      />
    </ThemedView>
  );
}
