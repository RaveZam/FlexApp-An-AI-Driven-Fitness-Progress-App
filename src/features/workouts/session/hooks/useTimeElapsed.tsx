import { useEffect, useState } from "react";
import computeElapsed from "../core/computeElapsed";

export default function useTimeElapsed(createdAt: string | null) {
  // Anchor on createdAt and recompute every tick so the value always
  // reflects real elapsed time, even after a remount or backgrounding.
  const [elapsed, setElapsed] = useState(() =>
    createdAt ? computeElapsed(createdAt) : 0,
  );

  useEffect(() => {
    if (!createdAt) return;

    setElapsed(computeElapsed(createdAt)); // resume immediately
    const id = setInterval(() => setElapsed(computeElapsed(createdAt)), 1000);

    return () => clearInterval(id);
  }, [createdAt]);

  if (!createdAt) return;

  return elapsed;
}
