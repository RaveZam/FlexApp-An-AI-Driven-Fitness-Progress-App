import { router } from "expo-router";
import { useEffect, useState } from "react";

export const useWorkoutPlanCreator = () => {
  const [selectedPlan, setSelectedPlan] = useState<any>([]);
  const [initialWorkoutPlan, setInitialWorkoutPlan] = useState<any>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [selectedWorkouts, setSelectedWorkouts] = useState<any[]>([]);
  const [repsPerSet, setRepsPerSet] = useState<any[]>([]);

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
    if (!key) return;
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
      return;
    }
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
    console.log("repsPerSet", repsPerSet);
  }, [selectedPlan, initialWorkoutPlan, selectedWorkouts, repsPerSet]);

  return {
    getCurrentIndexDay,
    handleStartPlan,
    addWorkout,
    selectedWorkouts,
    repsPerSet,
    setRepsPerSet,
    handleNextDay,
  };
};
