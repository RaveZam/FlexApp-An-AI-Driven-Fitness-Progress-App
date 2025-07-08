import { useAuth } from "@/auth/useAuth";
import { supabase } from "@/scripts/SupabaseClient";
import { router } from "expo-router";
import { useEffect, useState } from "react";

export const useWorkoutPlanCreator = () => {
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<any>([]);
  const [initialWorkoutPlan, setInitialWorkoutPlan] = useState<any>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [selectedWorkouts, setSelectedWorkouts] = useState<any[]>([]);
  const [repsPerSet, setRepsPerSet] = useState<any[]>([]);
  const [shouldSave, setShouldSave] = useState<boolean>(false);

  const handleStartPlan = (plan: string) => {
    const steps = getStepsFromPlan(plan);
    setSelectedPlan(steps);
    setInitialWorkoutPlan(getInitialWorkoutPlan(steps));
    router.push("/Workouts/WorkoutSelector");
  };

  const getStepsFromPlan = (selectedPlan: string) => {
    switch (selectedPlan) {
      case "Push Pull Legs":
        return [
          { day: "Push", key: "push" },
          { day: "Pull", key: "pull" },
          { day: "Leg", key: "legs" },
        ];
      case "Upper Lower":
        return [
          { day: "Upper Body", key: "upper" },
          { day: "Lower Body", key: "lower" },
        ];
      case "Full Body":
        return [
          { day: "Full Body Day 1", key: "full1" },
          { day: "Full Body Day 2", key: "full2" },
        ];
      default:
        return [];
    }
  };

  const getInitialWorkoutPlan = (steps: any[]) => {
    return {
      workoutPlan: steps.map((step) => ({
        key: step.day,
        workouts: [],
      })),
    };
  };

  const getCurrentIndexDay = () => {
    return initialWorkoutPlan.workoutPlan?.[currentStepIndex].key;
  };

  function addWorkout(workout_name: string, id: number, workout_image: string) {
    if (selectedWorkouts.some((workout) => workout.id === id)) {
      setSelectedWorkouts((prev) =>
        prev.filter((workout) => workout.id !== id)
      );
      return;
    }

    const key = selectedPlan[currentStepIndex]?.key;
    console.log(selectedWorkouts);
    if (!key) return;

    const workoutObject = {
      id,
      workout_name,
      workout_image,
      sets: 3,
      reps: "8-10",
    };

    setSelectedWorkouts((prev) => [...prev, workoutObject]);
  }

  function handleNextDay() {
    const key = selectedPlan[currentStepIndex]?.key;
    if (!key) {
      console.log("No key found");
      return;
    }
    setInitialWorkoutPlan((prev: any) => {
      const updatedWorkoutPlan = [...prev.workoutPlan];
      updatedWorkoutPlan[currentStepIndex] = {
        ...updatedWorkoutPlan[currentStepIndex],
        workouts: repsPerSet,
      };
      return { ...prev, workoutPlan: updatedWorkoutPlan };
    });

    setSelectedWorkouts([]);
    setRepsPerSet([]);
    if (currentStepIndex < selectedPlan.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
      router.push("/Workouts/WorkoutSelector");
    } else {
      saveToSupaBase();
      setShouldSave(true);
    }
  }

  function navigateToSummary() {
    router.push("/Workouts/Summary");
  }

  useEffect(() => {
    setRepsPerSet((prev) => {
      const updated = selectedWorkouts.map((workout) => {
        const existing = prev.find((w) => w.id === workout.id);
        return existing ?? { ...workout, sets: 2, reps: "8-10" };
      });
      return updated;
    });
  }, [selectedWorkouts]);

  useEffect(() => {
    console.log("initialWorkoutPlan", initialWorkoutPlan);
  }, [initialWorkoutPlan]);

  useEffect(() => {
    if (shouldSave && initialWorkoutPlan.workoutPlan?.length > 0) {
      console.log("Saving to SupaBase with complete plan:", initialWorkoutPlan);
      saveToSupaBase();
      setShouldSave(false);
    }
  }, [shouldSave, initialWorkoutPlan]);

  async function saveToSupaBase() {
    console.log("Initla Workout Plan", initialWorkoutPlan);
    try {
      const { data: plan, error: planError } = await supabase
        .from("workout_plans")
        .insert({
          user_id: user?.id,
          name: "Test",
          is_active: false,
          created_at: new Date(),
        })
        .select()
        .single();

      if (planError || !plan) {
        console.error("Plan insert error:", planError);

        return;
      }

      // 2. Loop through each workout day

      for (let i = 0; i < initialWorkoutPlan.workoutPlan.length; i++) {
        const day = initialWorkoutPlan.workoutPlan[i];

        const { data: dayData, error: dayError } = await supabase
          .from("plan_per_day")
          .insert({
            workout_plan_id: plan.id,
            day_name: day.key,
          })
          .select()
          .single();

        if (dayError || !dayData) {
          console.error(`Day insert failed for ${day.key}:`, dayError);
          continue;
        }

        const workoutsToInsert = day.workouts.map((workout: any) => ({
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
            `Workout insert failed for ${day.key}:`,
            workoutInsertError
          );
        }
      }

      console.log("Success", "Workout plan saved to your account!");
    } catch (err) {
      console.error("Unexpected error saving workout plan:", err);
      console.log("Unexpected Error", "Something went wrong.");
    }
  }

  return {
    getCurrentIndexDay,
    handleStartPlan,
    addWorkout,
    selectedWorkouts,
    repsPerSet,
    setRepsPerSet,
    handleNextDay,
    saveToSupaBase,
    navigateToSummary,
  };
};
