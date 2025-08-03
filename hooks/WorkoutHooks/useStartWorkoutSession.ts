import { useAuth } from "@/auth/useAuth";
import { startWorkoutService } from "@/services/startWorkoutService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { navgationHelpers } from "../../helpers/navigationHelpers";
import { useGetCurrentWorkoutToday } from "../useGetCurrentWorkoutToday";
import { useWorkoutContext } from "../useWorkoutPlanContext";

export const useStartWorkoutSession = () => {
  const { user } = useAuth();
  const { currentWorkout } = useGetCurrentWorkoutToday();
  const { activeWorkoutID } = useWorkoutContext();

  const startWorkoutSession = async () => {
    navgationHelpers.startWorkout();
    console.log(user?.id);
    const sessionID = await startWorkoutService.createWorkoutSession({
      user_id: user?.id ?? "",
      workout_plan_id: activeWorkoutID ?? 0,
      plan_per_day_id: currentWorkout?.id ?? 0,
      status: "in-progress",
    });
    const expiresAt = Date.now() + 10 * 60 * 1000;
    const payload = JSON.stringify({ sessionID, expiresAt });
    await AsyncStorage.setItem("workoutSession", payload);
  };

  return { startWorkoutSession };
};
