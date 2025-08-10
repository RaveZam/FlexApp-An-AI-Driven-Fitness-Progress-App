import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";
import { AppState } from "react-native";

const CLEAR_HOUR = 0; // 12 AM
const LAST_CLEAR_KEY = "lastClearDate";

export function useStorageCleaner() {
  const clearStorage = async () => {
    try {
      await AsyncStorage.removeItem("workoutSession");
      await AsyncStorage.removeItem("startDate");
      await AsyncStorage.removeItem("finishedWorkouts");

      await AsyncStorage.setItem(LAST_CLEAR_KEY, new Date().toDateString());
    } catch (e) {
      console.error("❌ Error clearing storage:", e);
    }
  };

  const checkAndClear = async () => {
    const now = new Date();

    if (now.getHours() >= CLEAR_HOUR) {
      const lastClear = await AsyncStorage.getItem(LAST_CLEAR_KEY);
      const today = now.toDateString();

      if (lastClear !== today) {
        await clearStorage();
      }
    }
  };

  useEffect(() => {
    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        checkAndClear();
      }
    });

    checkAndClear();

    return () => {
      sub.remove();
    };
  }, []);
}
