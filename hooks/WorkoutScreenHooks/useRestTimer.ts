import { useEffect, useState } from "react";

export const useRestTimer = () => {
  const [showRestTimer, setShowRestTimer] = useState(false);
  const [isRestTimerActive, setIsRestTimerActive] = useState(false);

  const [restTime, setRestTime] = useState(180);
  const onClose = () => {};

  const handleStartNextSet = () => {
    setShowRestTimer(false);
    setIsRestTimerActive(false);
    setRestTime(180);
  };

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

  return {
    onClose,
    handleStartNextSet,
    setShowRestTimer,
    restTime,
    setRestTime,
    showRestTimer,
    isRestTimerActive,
    setIsRestTimerActive,
  };
};
