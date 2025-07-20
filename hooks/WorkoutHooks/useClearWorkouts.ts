import { useWorkoutContext } from "../useWorkoutPlanContext";

export const useClearWorkouts = () => {
  const { setSelectedWorkouts, setRepsPerSet } = useWorkoutContext();

  function clearWorkouts() {
    setSelectedWorkouts([]);
    setRepsPerSet([]);
  }

  return {
    clearWorkouts,
  };
};
