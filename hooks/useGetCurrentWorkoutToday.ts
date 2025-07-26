import { useEffect, useState } from "react";
import { useFetchPlanDetails } from "./useFetchPlanDetails";
import { useFetchWorkoutPlans } from "./useFetchWorkoutPlans";
import { useGetDays } from "./useGetDays";

export const useGetCurrentWorkoutToday = () => {
  const [currentWorkout, setCurrentWorkout] = useState<any>(null);
  const { activeWorkoutID } = useFetchWorkoutPlans();
  const { workouts, planDetails, fetchPlanAndWorkouts, loading } =
    useFetchPlanDetails();
  const { getTodayDay } = useGetDays();

  useEffect(() => {
    if (activeWorkoutID) {
      fetchPlanAndWorkouts(activeWorkoutID.toString());
    }
  }, [activeWorkoutID]);

  useEffect(() => {
    console.log(workouts);
  }, [workouts]);

  useEffect(() => {
    const currentWorkout = workouts?.find((workout: any) => {
      return workout.day === getTodayDay().name;
    });
    setCurrentWorkout(currentWorkout);
  }, [workouts]);

  return { currentWorkout, loading };
};
