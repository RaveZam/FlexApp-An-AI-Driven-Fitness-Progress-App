import { useEffect, useState } from "react";

export const useWorkoutLogs = () => {
  const [currentSet, setCurrentSet] = useState(1);
  const [workoutLog, setWorkoutLog] = useState<
    Array<{ weight: string; reps: string }>
  >([]);
  const [currentWeight, setCurrentWeight] = useState("");
  const [currentReps, setCurrentReps] = useState("");

  useEffect(() => {
    console.log("workoutLog", workoutLog);
  }, [workoutLog]);

  const handleSaveWorkoutLog = () => {
    console.log("currentWeight", currentWeight);
    console.log("currentReps", currentReps);
    if (currentWeight && currentReps) {
      setWorkoutLog([
        ...workoutLog,
        { weight: currentWeight, reps: currentReps },
      ]);
      setCurrentWeight("");
      setCurrentReps("");
      setCurrentSet(currentSet + 1);
    }
  };

  const handleCloseWorkoutLog = () => {
    setCurrentWeight("");
    setCurrentReps("");
  };

  return {
    currentSet,
    setCurrentSet,
    workoutLog,
    setWorkoutLog,
    currentWeight,
    setCurrentWeight,
    currentReps,
    setCurrentReps,
    handleSaveWorkoutLog,
    handleCloseWorkoutLog,
  };
};
