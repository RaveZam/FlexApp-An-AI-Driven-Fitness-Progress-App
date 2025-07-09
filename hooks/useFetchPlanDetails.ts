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

      // Fetch plan days with their workouts and workout details in one query
      const { data: planData, error: planError } = await supabase
        .from("plan_per_day")
        .select(
          `*,
          workouts_per_day (
            *,
            workout_id (
              workout_name,
              workout_description,
              muscle_group,
              workout_image
            )
          )
        `
        )
        .eq("workout_plan_id", planId);

      if (planError) {
        throw planError;
      }
      console.log("Plan Data with Workouts", planData);
      setPlanDetails(planData?.[0] || null); // Optionally set the first plan day as details
      setWorkouts(planData || []); // Set all plan days with their workouts
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
