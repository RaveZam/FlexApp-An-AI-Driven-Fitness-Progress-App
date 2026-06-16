import { useState } from "react";

export function useExerciseList(onSelect: (index: number) => void) {
  const [showExercisesList, setShowExercisesList] = useState(false);

  return {
    showExercisesList,
    openExercisesList: () => setShowExercisesList(true),
    closeExercisesList: () => setShowExercisesList(false),
    // Picking an exercise both navigates the session and dismisses the sheet.
    selectExercise: (index: number) => {
      onSelect(index);
      setShowExercisesList(false);
    },
  };
}
