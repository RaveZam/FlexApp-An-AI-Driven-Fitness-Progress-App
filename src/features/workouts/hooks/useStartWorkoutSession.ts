import { useAuth } from "@/src/features/auth/hooks/useAuth";
import { startWorkoutService } from "@/src/features/workouts/services/startWorkoutService";
import { navgationHelpers } from "../helpers/navigationHelpers";
import { useGetCurrentWorkoutToday } from "./useGetCurrentWorkoutToday";
import { useWorkoutContext } from "./useWorkoutPlanContext";
import { useWorkoutSession } from "./useWorkoutSession";
import { useWorkoutSessionTimer } from "./useWorkoutSessionTimer";

export const useStartWorkoutSession = () => {
  const { user } = useAuth();
  const { currentWorkout } = useGetCurrentWorkoutToday();
  const { activeWorkoutID } = useWorkoutContext();
  const { setWorkoutSession, checkWorkoutSession } = useWorkoutSession();
  const { setActiveWorkoutSession } = useWorkoutContext();
  const { loadStartTime } = useWorkoutSessionTimer();

  const startWorkoutSession = async () => {
    console.log("Starting New Workout Session");
    navgationHelpers.startWorkout();
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
    setActiveWorkoutSession(sessionID);
    console.log("New Active Workout Session", sessionID);
  };

  const resumeWorkoutSession = async () => {
    loadStartTime();
    console.log("Resuming Active Workout Session");
    navgationHelpers.startWorkout();
    const sessionID = await checkWorkoutSession();
    if (!sessionID) {
      return;
    }
    setWorkoutSession(sessionID);
    console.log("Resumed Active Workout Session", sessionID);
  };

  return { startWorkoutSession, resumeWorkoutSession };
};
