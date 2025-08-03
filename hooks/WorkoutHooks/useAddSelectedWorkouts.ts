// import { useSaveWorkout } from "@/services/useSaveWorkout";
import { navgationHelpers } from "../../helpers/navigationHelpers";
import { useWorkoutContext } from "../useWorkoutPlanContext";
import { useClearWorkouts } from "./useClearWorkouts";

export const useAddSelectedWorkouts = () => {
  const {
    repsPerSet,
    setInitialWorkoutPlan,
    currentStepIndex,
    setCurrentStepIndex,
    initialWorkoutPlan,
    setShouldSave,
  } = useWorkoutContext();

  const { clearWorkouts } = useClearWorkouts();

  function handleNextDay() {
    setInitialWorkoutPlan((prev: any) => {
      const updatedWorkoutPlan = [...prev.workoutPlan];
      updatedWorkoutPlan[currentStepIndex] = {
        ...updatedWorkoutPlan[currentStepIndex],
        workouts: repsPerSet,
      };
      return { ...prev, workoutPlan: updatedWorkoutPlan };
    });

    if (currentStepIndex < (initialWorkoutPlan?.workoutPlan?.length ?? 0) - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
      clearWorkouts();
      navgationHelpers.goToWorkoutSelector();
    } else {
      clearWorkouts();
      setShouldSave(true);
      return;
    }
  }

  return {
    handleNextDay,
  };
};
