import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import Button from "@/components/ui/Button";
import ExercisesModal from "@/components/ui/ExercisesModal";
import RestTimerOverlay from "@/components/ui/RestTimerOverlay";
import WorkoutLogOverlay from "@/components/ui/WorkoutLogOverlay";
import HistoryCard from "@/components/WorkoutScreenComponents/PersonalRecordAndHistoryComponents/HistoryCard";
import PersonalRecordsCard from "@/components/WorkoutScreenComponents/PersonalRecordAndHistoryComponents/PersonalRecordsCard";
import SelectedWorkoutCard from "@/components/WorkoutScreenComponents/SelectedWorkoutCard";
import WorkoutScreenHeader from "@/components/WorkoutScreenComponents/WorkoutScreenHeader";
import WorkoutTimers from "@/components/WorkoutScreenComponents/WorkoutTimers";
import { useFetchWorkoutPlans } from "@/hooks/useFetchWorkoutPlans";
import { useWorkoutContext } from "@/hooks/useWorkoutPlanContext";
import { useWorkoutSessionTimer } from "@/hooks/WorkoutHooks/useWorkoutSessionTimer";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function index() {
  useFetchWorkoutPlans();
  const { currentWorkout, setActiveWorkoutSession } = useWorkoutContext();
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
  const { time, formatTime, removeTimer, startTimer, loadStartTime } =
    useWorkoutSessionTimer();
  const { activeWorkoutSession } = useWorkoutContext();

  useEffect(() => {
    const loadPreviousTimer = async () => {
      const previousTimer = await loadStartTime();
      if (!previousTimer) {
        startTimer();
      }
    };
    loadPreviousTimer();
  }, [activeWorkoutSession]);

  useEffect(() => {
    console.log("Selected Workout", selectedExercise);
  }, [selectedExercise]);

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
        <WorkoutScreenHeader setShowExercisesModal={setShowExercisesModal} />
        {/* Timers Section */}
        <WorkoutTimers formatTime={formatTime} time={time} />

        <ScrollView className="flex-1 " showsVerticalScrollIndicator={false}>
          <View className="bg-lightDark p-4">
            <SelectedWorkoutCard displayExercise={selectedExercise} />

            {/* Personal Record and History */}
            <View className="flex-row justify-around w-full m-4 ">
              <PersonalRecordsCard />
              <HistoryCard />
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
