import { useEffect, useState } from "react";

export const useWorkoutPlanCreator = () => {
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const [selectedDay, setSelectedDay] = useState<string>("");
  const [workoutPlan, setWorkoutPlan] = useState<Record<string, any[]>>({});

  const [selectedWorkouts, setSelectedWorkouts] = useState<any[]>([]);
  const [repsPerSet, setRepsPerSet] = useState<any[]>([]);

  const [step, setStep] = useState(0);
  const [currentStep, setCurrentStep] = useState<any>(0);

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
  const steps = getStepsFromPlan(selectedPlan);

  const getInitialWorkoutPlan = (selectedPlan: string) => {
    const steps = getStepsFromPlan(selectedPlan);
    const emptyPlan: Record<string, any[]> = {};

    steps.forEach((step) => {
      emptyPlan[step.key] = [];
    });

    return emptyPlan;
  };

  const initialWorkoutPlan = getInitialWorkoutPlan(selectedPlan);

  function nextStep() {
    setStep(step + 1);
    setCurrentStep(steps[step]);
    console.log("Next Step");
  }

  function prevStep() {
    setStep(step - 1);
    setCurrentStep(steps[step]);
    console.log("Prev Step");
  }

  function addWorkout(workout_name: string, id: number, workout_image: string) {
    const key = steps[step]?.key;
    if (!key) return;

    const workoutObject = {
      id,
      workout_name,
      workout_image,
      sets: 3,
      reps: "8-10",
    };

    setWorkoutPlan((prev) => ({
      ...prev,
      [key]: [...prev[key], workoutObject],
    }));
  }

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
    addWorkout,
    nextStep,
    prevStep,
    step,
    setStep,
    currentStep,
    initialWorkoutPlan,
  };
};

// addWorkout,
// repsPerSet,
// setRepsPerSet,

// function addWorkout(workout_name: string, id: number, workout_image: string) {
//   const key = steps[step]?.key;
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
