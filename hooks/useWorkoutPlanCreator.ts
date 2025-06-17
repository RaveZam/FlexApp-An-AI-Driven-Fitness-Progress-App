import { useState } from "react";

export const useWorkoutPlanCreator = () => {
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const [selectedDay, setSelectedDay] = useState<string>("");
  const [workoutPlan, setWorkoutPlan] = useState<Record<string, any[]>>({});

  const [selectedWorkouts, setSelectedWorkouts] = useState<any[]>([]);

  function addWorkout(workout_name: string, id: number, workout_image: string) {
    if (selectedWorkouts.some((selectedWorkout) => selectedWorkout.id === id)) {
      setSelectedWorkouts(
        selectedWorkouts.filter((selectedWorkout) => selectedWorkout.id !== id)
      );
      return;
    }

    const workoutObject = {
      id,
      workout_name,
      workout_image,
    };
    setSelectedWorkouts([...selectedWorkouts, workoutObject]);
  }

  return {
    selectedPlan,
    setSelectedPlan,
    selectedDay,
    setSelectedDay,
    workoutPlan,
    setWorkoutPlan,
    selectedWorkouts,
    addWorkout,
  };
};
