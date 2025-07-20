import { useWorkoutContext } from "../useWorkoutPlanContext";
import { useClearWorkouts } from "./useClearWorkouts";
import { navgationHelpers } from "@/app/helpers/navigationHelpers";

export const useAddSelectedWorkouts = () => {
  const {
    repsPerSet,
    setInitialWorkoutPlan,
    currentStepIndex,
    setCurrentStepIndex,
    customWorkoutPlan,
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

    if (currentStepIndex < customWorkoutPlan?.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
      clearWorkouts();
      navgationHelpers.goToWorkoutSelector();
    } else {
      setShouldSave(true);
      return;
    }
  }

  return {
    handleNextDay,
  };
};
