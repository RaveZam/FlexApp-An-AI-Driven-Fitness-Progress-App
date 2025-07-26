import { supabase } from "@/scripts/SupabaseClient";
import { InitialWorkoutPlan } from "@/types/WorkoutTypes";

export class workoutPlanService {
  static async saveToSupaBase(
    initialWorkoutPlan: InitialWorkoutPlan | null,
    userID: string | undefined,
    planName: string,
    setShowSuccessPopup: (show: boolean) => void,
    setShouldSave: (shouldSave: boolean) => void
  ) {
    console.log("Initial Workout Plan", initialWorkoutPlan);
    try {
      const { data: plan, error: planError } = await supabase
        .from("workout_plans")
        .insert({
          user_id: userID,
          name: planName || "Custom",
          is_active: false,
          created_at: new Date(),
        })
        .select()
        .single();

      if (planError || !plan) {
        console.error("Plan insert error:", planError);
        return;
      }

      for (let i = 0; i < (initialWorkoutPlan?.workoutPlan?.length ?? 0); i++) {
        const day = initialWorkoutPlan?.workoutPlan[i];

        const { data: dayData, error: dayError } = await supabase
          .from("plan_per_day")
          .insert({
            workout_plan_id: plan.id,
            day_name: day?.key,
            day: day?.dayOfTheWeek,
          })
          .select()
          .single();

        if (dayError || !dayData) {
          console.error(`Day insert failed for ${day?.key}:`, dayError);
          continue;
        }

        const workoutsToInsert = day?.workouts.map((workout: any) => ({
          plan_per_day_id: dayData.id,
          workout_id: workout.id,
          sets: workout.sets,
          reps: workout.reps,
          rest_time: 120,
        }));

        const { error: workoutInsertError } = await supabase
          .from("workouts_per_day")
          .insert(workoutsToInsert);

        if (workoutInsertError) {
          console.error(
            `Workout insert failed for ${day?.key}:`,
            workoutInsertError
          );
        }
      }

      console.log("Success", "Workout plan saved to your account!");
      setShowSuccessPopup(true);
    } catch (err) {
      console.error("Unexpected error saving workout plan:", err);
      console.log("Unexpected Error", "Something went wrong.");
    }
  }
}
