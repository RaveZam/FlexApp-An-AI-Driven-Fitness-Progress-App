import { router } from "expo-router";

export const navgationHelpers = {
  goToWorkoutSelector: () => {
    router.push("/Workouts/WorkoutSelector");
  },

  navigateToSummary: () => {
    router.push("/Workouts/Summary");
  },

  goToWorkoutScreen: () => {
    router.push("/Workouts");
  },
};
