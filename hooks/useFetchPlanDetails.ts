import { supabase } from "@/scripts/SupabaseClient";
import { useState } from "react";

export const useFetchPlanDetails = () => {
  const [planDetails, setPlanDetails] = useState<any | null>(null);
  const [workouts, setWorkouts] = useState<any[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchPlanAndWorkouts = async (planId: string) => {
    if (!planId) return;

    try {
      setLoading(true);
      setError(null);

      // Fetch plan details
      const { data: planData, error: planError } = await supabase
        .from("plan_per_day")
        .select("*")
        .eq("workout_plan_id", planId);

      if (planError) {
        throw planError;
      }

      console.log(planData);
      setPlanDetails(planData);

      const workoutPerDay = await Promise.all(
        planData.map(async (day: any) => {
          const { data: workoutsData, error: workoutsError } = await supabase
            .from("workouts_per_day")
            .select("*")
            .eq("plan_per_day_id", day.id);

          if (workoutsError) {
            throw workoutsError;
          }

          return workoutsData;
        })
      );
      console.log("Workouts Per Day", workoutPerDay);
      setWorkouts(workoutPerDay);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const clearData = () => {
    setPlanDetails(null);
    setWorkouts(null);
    setError(null);
  };

  return {
    planDetails,
    workouts,
    loading,
    error,
    fetchPlanAndWorkouts,
    clearData,
  };
};
