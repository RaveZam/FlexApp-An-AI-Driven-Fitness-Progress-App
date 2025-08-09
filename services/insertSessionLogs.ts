import { supabase } from "@/scripts/SupabaseClient";

// Create
export const insertSessionLog = async (
  session_id: number | null,
  workout_id: number | null,
  set_number: number,
  reps: string,
  weight: string
): Promise<number | null> => {
  try {
    const { data, error } = await supabase
      .from("session_logs")
      .insert([{ session_id, workout_id, set_number, reps, weight }])
      .select();

    if (error) throw error;
    return data?.[0]?.id ?? null;
  } catch (err) {
    console.error("Error inserting session log:", err);
    return null;
  }
};

export const deleteSessionLog = async (session_log_id: string) => {
  try {
    const { data, error } = await supabase
      .from("session_logs")
      .delete()
      .eq("session_id", session_log_id);

    if (error) throw error;
    return data;
  } catch (err) {
    console.error("Error deleting session log:", err);
    return null;
  }
};

export const getWorkoutSessionLog = async (
  session_id: number | null,
  workout_id: number | null
) => {
  try {
    const { data, error } = await supabase
      .from("session_logs")
      .select("*")
      .eq("session_id", session_id)
      .eq("workout_id", workout_id);

    if (error) throw error;

    if (data) {
      return data ?? [];
    }
  } catch (err) {
    console.error("Error getting session log:", err);
    return null;
  }
};
