import { useWorkoutContext } from "../useWorkoutPlanContext";

export const useAddWorkout = () => {
  const { selectedWorkouts, setSelectedWorkouts } = useWorkoutContext();

  function addWorkout(workout_name: string, id: number, workout_image: string) {
    console.log("Adding workout");
    if (selectedWorkouts.some((workout) => workout.id === id)) {
      setSelectedWorkouts((prev) =>
        prev.filter((workout: any) => workout.id !== id)
      );
      return;
    }

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
