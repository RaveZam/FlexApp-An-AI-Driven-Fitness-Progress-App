import { supabase } from "@/src/lib/supabase";

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

export const updateFinishedWorkout = async (workout_session_id: number) => {
  try {
    const { data, error } = await supabase
      .from("workout_sessions")
      .update({ status: "completed", end_time: new Date() })
      .eq("id", workout_session_id);
  } catch (err) {
    console.error("Error updating finished workout:", err);
  }
};

export const getSessionStatus = async (session_id: number) => {
  try {
    const { data, error } = await supabase
      .from("workout_sessions")
      .select("status")
      .eq("id", session_id);

    if (error) throw error;
    return data?.[0]?.status ?? null;
  } catch (err) {
    console.error("Error getting session status:", err);
  }
};
