import { useCallback } from "react";
import { useActivePlan } from "../../context/ActivePlanContext";
import {
  deletePlanLocal,
  renamePlanLocal,
} from "../../services/workoutLocalService";

export function useEditPlan(planId: string | undefined) {
  const { activePlanId, setActivePlan } = useActivePlan();

  const renamePlan = useCallback(
    (name: string) => {
      if (!planId) return;
      renamePlanLocal(planId, name);
    },
    [planId]
  );

  const deletePlan = useCallback(() => {
    if (!planId) return;
    if (activePlanId === planId) setActivePlan(null);
    deletePlanLocal(planId);
  }, [planId, activePlanId, setActivePlan]);

  return { renamePlan, deletePlan };
}
