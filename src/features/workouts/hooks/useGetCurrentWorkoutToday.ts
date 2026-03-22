import { useEffect } from "react";
import { useFetchPlanDetails } from "./useFetchPlanDetails";
import { useFetchWorkoutPlans } from "./useFetchWorkoutPlans";
import { useGetDays } from "./useGetDays";
import { useWorkoutContext } from "./useWorkoutPlanContext";

export const useGetCurrentWorkoutToday = () => {
  const { currentWorkout, setCurrentWorkout, activeWorkoutID } =
    useWorkoutContext();
  const { workouts, fetchPlanAndWorkouts, loading } = useFetchPlanDetails();
  const { getTodayDay } = useGetDays();

  useEffect(() => {
    if (activeWorkoutID) {
      fetchPlanAndWorkouts(activeWorkoutID.toString());
    }
  }, [activeWorkoutID]);

  useEffect(() => {
    const currentWorkout = workouts?.find((workout: any) => {
      return workout.day === getTodayDay().name;
    });

    setCurrentWorkout(currentWorkout);
  }, [workouts]);

  return { currentWorkout, loading };
};
