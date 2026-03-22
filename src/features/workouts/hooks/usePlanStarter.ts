import {
  getInitialWorkoutPlan,
  getStepsFromPlan,
} from "../helpers/workoutHelpers";
import { useWorkoutContext } from "./useWorkoutPlanContext";
import { navgationHelpers } from "../helpers/navigationHelpers";

export const usePlanStarter = () => {
  const { setPlanName, setSelectedPlan, setInitialWorkoutPlan } =
    useWorkoutContext();

  const handleStartPlan = (plan: string) => {
    setPlanName(plan);
    const steps = getStepsFromPlan(plan);
    setSelectedPlan(steps as any);
    setInitialWorkoutPlan(getInitialWorkoutPlan(steps));
    navgationHelpers.goToWorkoutSelector();
  };
  return {
    handleStartPlan,
  };
};
