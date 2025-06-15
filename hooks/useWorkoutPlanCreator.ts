import { useEffect, useState } from "react";

export const useWorkoutPlanCreator = () => {
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const [selectedDay, setSelectedDay] = useState<string>("");
  const [workoutPlan, setWorkoutPlan] = useState<Record<string, any[]>>({});

  // useEffect(() => {
  //   if (selectedPlan === "Push Pull Legs") {
  //     setWorkoutPlan({
  //       Push: [],
  //       Pull: [],
  //       Legs: [],
  //     });
  //   }
  // }, [selectedPlan]);

  return {
    selectedPlan,
    setSelectedPlan,
    selectedDay,
    setSelectedDay,
    workoutPlan,
    setWorkoutPlan,
  };
};
