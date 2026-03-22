import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { useWorkoutContext } from "./useWorkoutPlanContext";

export const useWorkoutSessionTimer = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const { activeWorkoutSession, setActiveWorkoutSession } = useWorkoutContext();

  const loadStartTime = async () => {
    const startDate = await AsyncStorage.getItem("startDate");
    if (startDate) {
      console.log("Previous Timer Found started on:", startDate);
      const now = Date.now();
      const startTime = Number(startDate);
      const elapsed = Math.floor((now - startTime) / 1000);
      setTime(elapsed);
      setIsRunning(true);
      return true;
    } else {
      return false;
    }
  };

  useEffect(() => {
    console.log("isRunning", isRunning);
    let interval: ReturnType<typeof setInterval>;

    if (isRunning && activeWorkoutSession) {
      interval = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, activeWorkoutSession]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const startTimer = () => {
    const startDate = Date.now().toString();
    AsyncStorage.setItem("startDate", startDate);
    setIsRunning(true);
  };

  const removeTimer = () => {
    AsyncStorage.removeItem("startDate");
    AsyncStorage.removeItem("workoutSession");
    setActiveWorkoutSession(null);
    setIsRunning(false);
    setTime(0);
  };
  const resetTimer = () => setTime(0);

  const stopTimer = () => {
    setIsRunning(false);
  };

  return {
    time,
    isRunning,
    startTimer,
    removeTimer,
    resetTimer,
    formatTime,
    loadStartTime,
    stopTimer,
  };
};
