import supabase from "@/scripts/SupabaseClient";
import { useEffect, useState } from "react";

const useWorkouts = () => {
  const [error, setError] = useState<string | null>(null);
  const [workouts, setWorkouts] = useState<any[]>([]);

  useEffect(() => {
    const fetchWorkouts = async () => {
      const { data, error } = await supabase
        .from("Workout Exercises")
        .select("*");

      if (error) {
        console.log("Error Fetching From Supabase");
        setError(error.message);
      }

      if (data) {
        console.log("Success From Supabase");
        setWorkouts(data);
      }
    };

    fetchWorkouts();
  }, []);

  return { workouts, error };
};

export default useWorkouts;
