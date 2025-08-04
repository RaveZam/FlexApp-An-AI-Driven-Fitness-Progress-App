import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { useWorkoutContext } from "../useWorkoutPlanContext";

export const useWorkoutSessionTimer = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const { activeWorkoutSession } = useWorkoutContext();

  useEffect(() => {
    const loadStartTime = async () => {
      const startDate = await AsyncStorage.getItem("startDate");
      if (startDate) {
        console.log("Previous Timer Found started on:", startDate);
        const now = Date.now();
        const startTime = Number(startDate);
        const elapsed = Math.floor((now - startTime) / 1000);

        setTime(elapsed);
        setIsRunning(true);
      } else {
        console.log("No Previous Timer Found, starting new timer");
        startTimer();
      }
    };
    loadStartTime();
  }, []);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (isRunning) {
      interval = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const startTimer = () => {
    const startDate = Date.now().toString();
    AsyncStorage.setItem("startDate", startDate);
    setIsRunning(true);
  };

  const removeTimer = async () => {
    await AsyncStorage.removeItem("startDate");
    setIsRunning(false);
    setTime(0);
  };
  const resetTimer = () => setTime(0);

  return { time, isRunning, startTimer, removeTimer, resetTimer, formatTime };
};
