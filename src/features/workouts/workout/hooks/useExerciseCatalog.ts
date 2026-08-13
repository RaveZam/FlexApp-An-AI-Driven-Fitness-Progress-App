import { listExerciseCatalog } from "../../services/workoutLocalService";

export function useExerciseCatalog() {
  return listExerciseCatalog();
}
