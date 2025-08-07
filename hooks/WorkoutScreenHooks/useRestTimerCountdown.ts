import { useEffect } from "react";

export const useRestTimerCountdown = (
  restTime: number,
  setRestTime: (time: (prev: number) => number) => void,
  isRestTimerActive: boolean,
  setIsRestTimerActive: (active: boolean) => void,
  setShowRestTimer: (show: boolean) => void
) => {
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isRestTimerActive && restTime > 0) {
      console.log("isRestTimerActive:", isRestTimerActive);
      interval = setInterval(() => {
        setRestTime((prev: number) => {
          if (prev <= 1) {
            setIsRestTimerActive(false);
            setShowRestTimer(false);
            return 180; // Reset to 3 minutes
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRestTimerActive, restTime]);

  return { restTime, setRestTime };
};
