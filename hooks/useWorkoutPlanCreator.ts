import { useEffect, useState } from "react";

export const useWorkoutPlanCreator = () => {
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const [selectedDay, setSelectedDay] = useState<string>("");
  const [workoutPlan, setWorkoutPlan] = useState<Record<string, any[]>>({});

  const [selectedWorkouts, setSelectedWorkouts] = useState<any[]>([]);
  const [repsPerSet, setRepsPerSet] = useState<any[]>([]);

  const getStepsFromPlan = (selectedPlan: string) => {
    switch (selectedPlan) {
      case "Push Pull Legs":
        return [
          { day: "Push Day", key: "push" },
          { day: "Pull Day", key: "pull" },
          { day: "Leg Day", key: "legs" },
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

  const [step, setStep] = useState(0);
  const steps = getStepsFromPlan(selectedPlan);
  const currentStep = steps[step];

  // function addWorkout(workout_name: string, id: number, workout_image: string) {
  //   if (selectedWorkouts.some((selectedWorkout) => selectedWorkout.id === id)) {
  //     setSelectedWorkouts(
  //       selectedWorkouts.filter((selectedWorkout) => selectedWorkout.id !== id)
  //     );
  //     return;
  //   }

  //   const workoutObject = {
  //     id,
  //     workout_name,
  //     workout_image,
  //   };
  //   setSelectedWorkouts([...selectedWorkouts, workoutObject]);
  // }

  useEffect(() => {
    setRepsPerSet((prev) => {
      const updated = selectedWorkouts.map((workout) => {
        const existing = prev.find((w) => w.id === workout.id);
        return existing ?? { ...workout, sets: 3, reps: "8-10" };
      });
      return updated;
    });
  }, [selectedWorkouts]);

  return {
    selectedPlan,
    setSelectedPlan,
    selectedDay,
    setSelectedDay,
    workoutPlan,
    setWorkoutPlan,
    selectedWorkouts,
    // addWorkout,
    // repsPerSet,
    // setRepsPerSet,
    step,
    setStep,
    // currentStep,
  };
};
