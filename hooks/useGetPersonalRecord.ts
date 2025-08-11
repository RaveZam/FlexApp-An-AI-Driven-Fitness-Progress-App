import { useAuth } from "@/auth/useAuth";
import { supabase } from "@/scripts/SupabaseClient";
import { useEffect, useState } from "react";
import { useWorkoutContext } from "./useWorkoutPlanContext";

export const useGetPersonalRecord = () => {
  const [personalRecord, setPersonalRecord] = useState<any | null>(null);
  const { user } = useAuth();
  const { selectedExercise } = useWorkoutContext();

  console.log("selectedExercise", selectedExercise?.workout_id?.id);

  useEffect(() => {
    const getPersonalRecord = async () => {
      const { data, error } = await supabase
        .from("session_logs")
        .select("*, workout_sessions!inner(user_id)")
        .eq("workout_sessions.user_id", user?.id)
        .eq("workout_id", selectedExercise?.workout_id?.id)
        .order("weight", { ascending: false })
        .order("reps", { ascending: false })
        .limit(1);

      if (error) throw error;

      if (data) {
        setPersonalRecord(data);
      }
    };

    getPersonalRecord();
  }, [selectedExercise?.workout_id?.id]);

  return { personalRecord, setPersonalRecord };
};
