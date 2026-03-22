import { supabase } from "@/src/lib/supabase";

export class startWorkoutService {
  static async createWorkoutSession({
    user_id,
    workout_plan_id,
    plan_per_day_id,
    status,
  }: {
    user_id: string;
    workout_plan_id: number;
    plan_per_day_id: number;
    status: string;
  }): Promise<number | null> {
    try {
      const { data, error } = await supabase
        .from("workout_sessions")
        .insert([
          {
            user_id,
            workout_plan_id,
            plan_per_day_id,
            status,
          },
        ])
        .select();

      return data?.[0]?.id;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
