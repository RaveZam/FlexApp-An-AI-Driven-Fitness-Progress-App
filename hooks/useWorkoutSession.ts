import AsyncStorage from "@react-native-async-storage/async-storage";

export const useWorkoutSession = () => {
  const setWorkoutSession = async (sessionID: number) => {
    const expiresAt = Date.now() + 60 * 60 * 1000; // 10 minutes
    const payload = JSON.stringify({ sessionID, expiresAt });
    await AsyncStorage.setItem("workoutSession", payload);
  };

  const checkWorkoutSession = async () => {
    const raw = await AsyncStorage.getItem("workoutSession");

    if (!raw) {
      console.log("No Active Workout Session");
      return null;
    }

    const { sessionID, expiresAt } = JSON.parse(raw);

    if (Date.now() > expiresAt) {
      await AsyncStorage.removeItem("workoutSession");
      console.log("Expired Active Workout Session");
      return null;
    }

    return sessionID;
  };

  return { setWorkoutSession, checkWorkoutSession };
};
