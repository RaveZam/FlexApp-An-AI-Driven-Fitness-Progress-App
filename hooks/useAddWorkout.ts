import { useWorkoutContext } from "./useWorkoutPlanContext";

export const useAddWorkout = () => {
  const {
    selectedWorkouts,
    selectedPlan,
    currentStepIndex,
    setSelectedWorkouts,
    customWorkoutPlan,
  } = useWorkoutContext();

  function addWorkout(workout_name: string, id: number, workout_image: string) {
    console.log("Adding workout");
    if (selectedWorkouts.some((workout) => workout.id === id)) {
      setSelectedWorkouts((prev) =>
        prev.filter((workout: any) => workout.id !== id)
      );
      return;
    }

    let key = "";
    if (selectedPlan.length > 0) {
      console.log("SelectedPlan Detected ");
      key = (selectedPlan[currentStepIndex] as any)?.key;
    }

    if (customWorkoutPlan.length > 0) {
      console.log("Custom workout Detected ");
      key = (customWorkoutPlan[currentStepIndex] as any)?.key;
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

    setSelectedWorkouts((prev: any) => [...prev, workoutObject]);
  }

  return {
    addWorkout,
  };
};
