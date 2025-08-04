import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import Button from "@/components/ui/Button";
import ExercisesModal from "@/components/ui/ExercisesModal";
import LineChart from "@/components/ui/LineChart";
import RestTimerOverlay from "@/components/ui/RestTimerOverlay";
import WorkoutLogOverlay from "@/components/ui/WorkoutLogOverlay";
import { useFetchWorkoutPlans } from "@/hooks/useFetchWorkoutPlans";
import { useWorkoutContext } from "@/hooks/useWorkoutPlanContext";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function index() {
  useFetchWorkoutPlans();
  const { currentWorkout } = useWorkoutContext();
  const router = useRouter();
  const [showExercisesModal, setShowExercisesModal] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<any>(null);
  const [showWorkoutLog, setShowWorkoutLog] = useState(false);
  const [showRestTimer, setShowRestTimer] = useState(false);
  const [currentSet, setCurrentSet] = useState(1);
  const [workoutLog, setWorkoutLog] = useState<
    Array<{ weight: string; reps: string }>
  >([]);
  const [currentWeight, setCurrentWeight] = useState("");
  const [currentReps, setCurrentReps] = useState("");
  const [restTime, setRestTime] = useState(180); // 3 minutes in seconds
  const [isRestTimerActive, setIsRestTimerActive] = useState(false);

  useEffect(() => {
    if (
      currentWorkout?.workouts_per_day &&
      currentWorkout.workouts_per_day.length > 0
    ) {
      setSelectedExercise(currentWorkout.workouts_per_day[0]);
    }
  }, [currentWorkout]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isRestTimerActive && restTime > 0) {
      interval = setInterval(() => {
        setRestTime((prev) => {
          if (prev <= 1) {
            setIsRestTimerActive(false);
            setShowRestTimer(false);
            return 180; // Reset to 3 minutes
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRestTimerActive, restTime]);

  const handleSaveWorkoutLog = () => {
    if (currentWeight && currentReps) {
      setWorkoutLog([
        ...workoutLog,
        { weight: currentWeight, reps: currentReps },
      ]);
      setCurrentWeight("");
      setCurrentReps("");
      setCurrentSet(currentSet + 1);
      setShowWorkoutLog(false);
      setShowRestTimer(true);
      setIsRestTimerActive(true);
    }
  };

  const handleCloseWorkoutLog = () => {
    setShowWorkoutLog(false);
    setCurrentWeight("");
    setCurrentReps("");
  };

  const handleStartNextSet = () => {
    setShowRestTimer(false);
    setIsRestTimerActive(false);
    setRestTime(180);
    setShowWorkoutLog(true);
  };

  const displayExercise =
    selectedExercise ||
    (currentWorkout?.workouts_per_day && currentWorkout.workouts_per_day[0]);

  const progressPercentage = ((180 - restTime) / 180) * 100;

  return (
    <SafeAreaView className="flex-1">
      <ThemedView className="flex-1">
        <View className="flex-row justify-between items-center ml-12 mx-8 py-8 border-b border-important">
          <TouchableOpacity onPress={() => router.back()}>
            <ThemedText className="text-whiteText">Exit</ThemedText>
          </TouchableOpacity>
          <ThemedText className="text-whiteText font-medium">
            Workout 1/6
          </ThemedText>
          <TouchableOpacity onPress={() => setShowExercisesModal(true)}>
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

            {/* Previous Sets */}
            {workoutLog.map((set, index) => (
              <View
                key={index}
                className="flex-row items-center bg-lightDark rounded-2xl p-4 mb-2"
              >
                <View className="flex-row items-center justify-center min-w-24">
                  <Text className="text-whiteText font-medium">
                    {set.weight}lb
                  </Text>
                </View>
                <View className="w-px h-6 bg-mutedText mx-4" />
                <View className="flex-row items-center justify-center min-w-24">
                  <Text className="text-whiteText font-medium">
                    {set.reps} Reps
                  </Text>
                </View>
                <View className="w-px h-6 bg-mutedText mx-4" />
              </View>
            ))}

            {/* Current Set Input */}
            <View className="flex-row items-center bg-lightDark rounded-2xl p-4 mb-2">
              <View className="flex-row items-center justify-center min-w-24">
                <Text className="text-whiteText font-medium">
                  Set {currentSet}
                </Text>
              </View>
              <View className="w-px h-6 bg-mutedText mx-4" />
              <View className="flex-row items-center justify-center min-w-24">
                <Text className="text-whiteText font-medium">Input</Text>
              </View>
              <View className="w-px h-6 bg-mutedText mx-4" />
            </View>
          </View>
        </ScrollView>

        <Button
          className="z-20"
          buttonText="Start Workout"
          onPress={() => setShowWorkoutLog(true)}
        />

        {/* Workout Log Overlay */}
        <WorkoutLogOverlay
          visible={showWorkoutLog}
          onClose={handleCloseWorkoutLog}
          onSave={handleSaveWorkoutLog}
          currentWeight={currentWeight}
          setCurrentWeight={setCurrentWeight}
          currentReps={currentReps}
          setCurrentReps={setCurrentReps}
          currentSet={currentSet}
          totalSets={displayExercise?.sets || 3}
          exerciseName={displayExercise?.workout_id?.workout_name || "Exercise"}
          workoutLog={workoutLog}
        />

        {/* Rest Timer Overlay */}
        <RestTimerOverlay
          visible={showRestTimer}
          onClose={() => setShowRestTimer(false)}
          onStartNextSet={handleStartNextSet}
          restTime={restTime}
          progressPercentage={progressPercentage}
          exerciseName={displayExercise?.workout_id?.workout_name || "Exercise"}
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
