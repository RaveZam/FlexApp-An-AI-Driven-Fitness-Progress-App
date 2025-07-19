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
  const [showSuccessPopup, setShowSuccessPopup] = useState<boolean>(false);
  const [planName, setPlanName] = useState<string>("");

  const [workoutNumberOfDays, setWorkoutNumberOfDays] = useState<number>(0);
  const [restDays, setRestDays] = useState<string[]>([]);

  const DaysOfTheWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const [workoutDayNames, setworkoutDayNames] = useState<string[]>([]);
  const workoutDays = DaysOfTheWeek.filter((day) => !restDays.includes(day));
  const [workoutDaysIndex, setWorkoutDaysIndex] = useState(0);

  // Custom Workout Logic

  useEffect(() => {
    // console.log(initialWorkoutPlan?.workoutPlan?.length);
    if (initialWorkoutPlan?.workoutPlan?.length == workoutDays.length) {
      console.log("You are done");
      // setisVisible(true);
      goToWorkoutSelector();
      console.log(initialWorkoutPlan);
    }
  }, [initialWorkoutPlan]);

  const customWorkoutPlan = workoutDayNames.map((day) => ({
    day: day,
    key: day.toLowerCase().replace(/\s+/g, "-"),
  }));

  useEffect(() => {
    setInitialWorkoutPlan(getInitialWorkoutPlan(customWorkoutPlan));
    console.log("Trigger");
  }, [workoutDayNames]);

  const handleNext = (dayInput: string) => {
    if (!dayInput) {
      return;
    }

    if (workoutDays.length - 1 > workoutDaysIndex) {
      setworkoutDayNames((prev) => [...prev, dayInput]);
      // setdayInput("");
      setWorkoutDaysIndex((prev) => prev + 1);
      return;
    } else {
      setworkoutDayNames((prev) => [...prev, dayInput]);
    }
  };

  // Custom Workout Logic

  const goToWorkoutSelector = () => {
    router.push("/Workouts/WorkoutSelector");
  };

  const handleStartPlan = (plan: string) => {
    setPlanName(plan);
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
      case "Custom":
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
    return initialWorkoutPlan?.workoutPlan?.[currentStepIndex]?.key;
  };

  function addWorkout(workout_name: string, id: number, workout_image: string) {
    console.log("Adding workout");
    if (selectedWorkouts.some((workout) => workout.id === id)) {
      setSelectedWorkouts((prev) =>
        prev.filter((workout) => workout.id !== id)
      );
      return;
    }

    let key = "";
    if (selectedPlan.length > 0) {
      console.log("SelectedPlan Detected ");
      key = selectedPlan[currentStepIndex]?.key;
    }

    if (customWorkoutPlan.length > 0) {
      console.log("Custom workout Detected ");
      key = customWorkoutPlan[currentStepIndex]?.key;
    }

    console.log("Key Found", key);
    if (!key) return;
    console.log("Key", key);

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
    let key = "";
    if (selectedPlan.length > 0) {
      console.log("SelectedPlan Detected ");
      key = selectedPlan[currentStepIndex]?.key;
    }

    if (customWorkoutPlan.length > 0) {
      console.log("Custom workout Detected ");
      key = customWorkoutPlan[currentStepIndex]?.key;
    }

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

    if (currentStepIndex < customWorkoutPlan?.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
      clearWorkouts();
      router.push("/Workouts/WorkoutSelector");
    } else {
      setShouldSave(true);
      return;
    }
  }

  function clearWorkouts() {
    setSelectedWorkouts([]);
    setRepsPerSet([]);
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
    if (shouldSave && initialWorkoutPlan?.workoutPlan?.length > 0) {
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

      for (let i = 0; i < initialWorkoutPlan?.workoutPlan.length; i++) {
        const day = initialWorkoutPlan?.workoutPlan[i];

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
      setShowSuccessPopup(true);
    } catch (err) {
      console.error("Unexpected error saving workout plan:", err);
      console.log("Unexpected Error", "Something went wrong.");
    }
  }

  const handleSuccessPopupClose = () => {
    setShowSuccessPopup(false);
    clearWorkouts();
    router.push("/Workouts");
  };

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
    showSuccessPopup,
    handleSuccessPopupClose,
    setWorkoutNumberOfDays,
    setRestDays,
    restDays,
    workoutNumberOfDays,
    setInitialWorkoutPlan,
    initialWorkoutPlan,
    handleNext,
    DaysOfTheWeek,
    workoutDays,
    workoutDaysIndex,
  };
};
