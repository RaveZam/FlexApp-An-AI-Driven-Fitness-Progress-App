import { useAuth } from "@/auth/useAuth";
import { startWorkoutService } from "@/services/startWorkoutService";
import { navgationHelpers } from "../../helpers/navigationHelpers";
import { useGetCurrentWorkoutToday } from "../useGetCurrentWorkoutToday";
import { useWorkoutContext } from "../useWorkoutPlanContext";
import { useWorkoutSession } from "../useWorkoutSession";

export const useStartWorkoutSession = () => {
  const { user } = useAuth();
  const { currentWorkout } = useGetCurrentWorkoutToday();
  const { activeWorkoutID } = useWorkoutContext();
  const { setWorkoutSession } = useWorkoutSession();

  const startWorkoutSession = async () => {
    navgationHelpers.startWorkout();
    console.log(user?.id);
    const sessionID = await startWorkoutService.createWorkoutSession({
      user_id: user?.id ?? "",
      workout_plan_id: activeWorkoutID ?? 0,
      plan_per_day_id: currentWorkout?.id ?? 0,
      status: "in-progress",
    });
    if (!sessionID) {
      return;
    }
    setWorkoutSession(sessionID);
    console.log("New Active Workout Session", sessionID);
  };

  return { startWorkoutSession };
};
