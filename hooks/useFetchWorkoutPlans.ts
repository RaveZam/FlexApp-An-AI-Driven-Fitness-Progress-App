import { useAuth } from "@/auth/useAuth";
import { supabase } from "@/scripts/SupabaseClient";
import { useEffect, useState } from "react";

export const useFetchWorkoutPlans = () => {
  const { user } = useAuth();
  const [workoutPlans, setWorkoutPlans] = useState<any[] | null>(null);
  const [activeWorkoutID, setActiveWorkoutID] = useState<number | null>(null);
  // const [workoutPlan, setWorkoutPlan] = useState<any[] | null>(null);
  // const [workoutPerDays, setWorkoutPerDays] = useState<any[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchWorkoutPlans = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data, error: supabaseError } = await supabase
          .from("workout_plans")
          .select("*")
          .eq("user_id", user.id);
        if (supabaseError) {
          throw supabaseError;
        }

        const activeWorkoutFirst = [
          ...data.filter((plan: any) => plan.is_active === true),
          ...data.filter((plan: any) => plan.is_active !== true),
        ];

        setWorkoutPlans(activeWorkoutFirst);
        setActiveWorkoutID(activeWorkoutFirst[0].id);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkoutPlans();
  }, [user?.id]);

  return { workoutPlans, loading, error, activeWorkoutID };
};
