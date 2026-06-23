import { useCallback, useEffect, useState } from "react";
import { parseSetInput } from "../core/parseSetInput";
import { currentSet, currentSetIndex } from "../core/sessionSetProgress";
import { useGetSessionSets } from "./useGetSessionSets";
import { useLogSet } from "./useLogSet";
import { useWorkoutSession } from "./useWorkoutSession";

// Owns the log-modal's form state: the active exercise's display info, the four
// input fields (sanitized on change), and the log/close handlers. The screen
// keeps the open/close toggle and passes it in as visible/onClose; everything
// else lives here so the modal is pure presentation.
export function useWorkoutLogForm(visible: boolean, onClose: () => void) {
  const { exercises, activeIndex } = useWorkoutSession();
  const active = exercises[activeIndex];
  const sets = useGetSessionSets(active.id);
  const logSet = useLogSet();

  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const [leftReps, setLeftReps] = useState("");
  const [rightReps, setRightReps] = useState("");

  const reset = useCallback(() => {
    setWeight("");
    setReps("");
    setLeftReps("");
    setRightReps("");
  }, []);

  useEffect(() => {
    if (visible) reset();
  }, [visible, reset]);

  const currentIndex = currentSetIndex(sets);
  const current = currentSet(sets);
  const totalSets = sets.length || active.targetSets;

  const inputs = { weight, reps, leftReps, rightReps };
  const canLog = parseSetInput(inputs, active.isUnilateral) !== null;

  const handleLog = () => {
    const id = logSet({
      sessionExerciseId: active.id,
      ...inputs,
      isUnilateral: active.isUnilateral,
    });
    if (!id) return;
    reset();
    onClose();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return {
    exercise: {
      name: active.name,
      isUnilateral: active.isUnilateral,
      setNumber: currentIndex === -1 ? totalSets : currentIndex + 1,
      totalSets,
      targetReps: current?.targetReps ?? active.targetReps,
    },
    inputs,
    onChange: {
      weight: (t: string) => setWeight(t.replace(/[^0-9.]/g, "")),
      reps: (t: string) => setReps(t.replace(/[^0-9]/g, "")),
      leftReps: (t: string) => setLeftReps(t.replace(/[^0-9]/g, "")),
      rightReps: (t: string) => setRightReps(t.replace(/[^0-9]/g, "")),
    },
    canLog,
    handleLog,
    handleClose,
  };
}
