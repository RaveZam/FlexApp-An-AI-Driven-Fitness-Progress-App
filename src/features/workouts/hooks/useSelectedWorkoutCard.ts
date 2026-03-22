import { useEffect } from "react";
import { useWorkoutContext } from "./useWorkoutPlanContext";

export const useSelectedWorkoutCard = () => {
  const { currentWorkout, selectedExercise, setSelectedExercise } =
    useWorkoutContext();

  useEffect(() => {
    if (
      currentWorkout?.workouts_per_day &&
      currentWorkout.workouts_per_day.length > 0
    ) {
      setSelectedExercise(currentWorkout.workouts_per_day[0]);
    }
  }, [currentWorkout]);

  const displayExercise =
    selectedExercise ||
    (currentWorkout?.workouts_per_day && currentWorkout.workouts_per_day[0]);

  return { selectedExercise, setSelectedExercise, displayExercise };
};
