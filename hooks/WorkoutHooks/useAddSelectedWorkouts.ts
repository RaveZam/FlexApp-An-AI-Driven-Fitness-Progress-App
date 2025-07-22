import { useSaveWorkout } from "@/services/useSaveWorkout";
import { useWorkoutContext } from "../useWorkoutPlanContext";
import { useClearWorkouts } from "./useClearWorkouts";
import { navgationHelpers } from "@/app/helpers/navigationHelpers";

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
      console.log(
        "Current Step index proceeding to next day",
        currentStepIndex
      );
      setCurrentStepIndex(currentStepIndex + 1);
      clearWorkouts();
      navgationHelpers.goToWorkoutSelector();
    } else {
      console.log("Else Save True Triggered");
      setShouldSave(true);
      return;
    }
  }

  return {
    handleNextDay,
  };
};
