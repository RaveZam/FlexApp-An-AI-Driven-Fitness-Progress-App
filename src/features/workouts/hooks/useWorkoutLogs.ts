import {
  getWorkoutSessionLog,
  insertSessionLog,
  updateFinishedWorkout,
} from "@/src/features/workouts/services/insertSessionLogs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { useWorkoutContext } from "./useWorkoutPlanContext";
import { useWorkoutSessionTimer } from "./useWorkoutSessionTimer";

export const useWorkoutLogs = () => {
  const STORAGE_KEY = "finishedWorkouts";

  const [currentWeight, setCurrentWeight] = useState("");
  const [currentReps, setCurrentReps] = useState("");
  const { stopTimer } = useWorkoutSessionTimer();
  const {
    activeWorkoutSession,
    currentSet,
    setCurrentSet,
    selectedExercise,
    workoutLog,
    setWorkoutLog,
    setFinishedWorkouts,
    currentWorkout,
  } = useWorkoutContext();

  useEffect(() => {
    console.log("Change Detected");
    console.log("currentSet", currentSet);
    loadWorkoutLogs();
  }, [selectedExercise, currentSet]);

  useEffect(() => {
    loadFinishedWorkouts();
  }, [currentSet]);

  const loadWorkoutLogs = async () => {
    console.log("selectedExercise", selectedExercise?.workout_id?.id);
    console.log("activeWorkoutSession", activeWorkoutSession);
    if (activeWorkoutSession && selectedExercise?.workout_id?.id) {
      console.log("Loading Workout Logs");
      const workoutLogs = await getWorkoutSessionLog(
        activeWorkoutSession,
        selectedExercise?.workout_id?.id
      );
      console.log("Workout Logs: ", workoutLogs);

      const workoutLogsArray = workoutLogs?.map((log) => ({
        weight: log.weight,
        reps: log.reps,
      }));
      setCurrentSet((workoutLogsArray?.length ?? 0) + 1);
      setWorkoutLog(workoutLogsArray ?? []);
    }
  };

  const addFinishedWorkout = async (workoutId: number) => {
    console.log("Adding Finished Workout: ", workoutId);
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      const workouts = jsonValue != null ? JSON.parse(jsonValue) : [];

      if (!workouts.includes(workoutId)) {
        workouts.push(workoutId);
      }
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(workouts));

      console.log("Workouts: ", workouts.length);
      if (workouts.length === currentWorkout.workouts_per_day.length) {
        console.log("Finishing Session");
        stopTimer();
        await updateFinishedWorkout(activeWorkoutSession ?? 0);
      }
    } catch (e) {
      console.error("Error saving workout:", e);
    }
  };

  const clearFinishedWorkouts = async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
  };

  const loadFinishedWorkouts = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      const workouts = jsonValue ? JSON.parse(jsonValue) : [];

      setFinishedWorkouts(workouts);
    } catch (e) {
      console.error("Error loading workouts:", e);
      return [];
    }
  };

  const handleSaveWorkoutLog = () => {
    console.log("currentWeight", currentWeight);
    console.log("currentReps", currentReps);
    if (currentWeight && currentReps) {
      insertSessionLog(
        activeWorkoutSession,
        selectedExercise.workout_id.id,
        currentSet,
        currentReps,
        currentWeight
      );
      setCurrentWeight("");
      setCurrentReps("");
      setCurrentSet(currentSet + 1);
    }
  };

  const handleFinishSession = async () => {
    await updateFinishedWorkout(activeWorkoutSession ?? 0);
  };

  const handleCloseWorkoutLog = () => {
    setCurrentWeight("");
    setCurrentReps("");
  };

  return {
    setCurrentSet,
    workoutLog,
    setWorkoutLog,
    currentWeight,
    setCurrentWeight,
    currentReps,
    setCurrentReps,
    handleSaveWorkoutLog,
    handleCloseWorkoutLog,
    loadWorkoutLogs,
    addFinishedWorkout,
    loadFinishedWorkouts,
    handleFinishSession,
  };
};
