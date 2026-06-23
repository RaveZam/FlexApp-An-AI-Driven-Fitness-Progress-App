import { router } from "expo-router";
import { useCallback } from "react";
import { currentSetIndex } from "../core/sessionSetProgress";
import finishSession from "../services/finishSession";
import { useGetSessionSets } from "./useGetSessionSets";
import { useWorkoutSession } from "./useWorkoutSession";

export type BottomBarMode = "log" | "next" | "finish";

// Drives the session bottom bar. While the active exercise still has unlogged
// sets the bar logs a set; once every set is done it advances to the next
// exercise, or finishes the workout when this is the last one.
export function useSessionBottomBar() {
  const { exercises, activeIndex, activeSessionId, goToNextExercise } =
    useWorkoutSession();
  const active = exercises[activeIndex];
  const sets = useGetSessionSets(active?.id ?? "");

  const allSetsComplete = sets.length > 0 && currentSetIndex(sets) === -1;
  const isLastExercise = activeIndex === exercises.length - 1;

  const mode: BottomBarMode = !allSetsComplete
    ? "log"
    : isLastExercise
      ? "finish"
      : "next";

  const advance = useCallback(() => {
    if (mode === "next") {
      goToNextExercise();
      return;
    }
    if (mode === "finish") {
      // Complete the session, then leave for Home. We deliberately don't refresh
      // the provider here: the session screen unmounts on replace, discarding the
      // now-stale activeSessionId, and the next session mounts a fresh provider
      // whose getActiveSessionForUser ignores completed sessions.
      finishSession(activeSessionId);
      router.replace("/(tabs)");
    }
  }, [mode, goToNextExercise, activeSessionId]);

  return { mode, advance };
}
