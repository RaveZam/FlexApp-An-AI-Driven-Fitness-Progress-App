import { WorkoutSessionProvider } from "@/src/features/workouts/session/context/WorkoutSessionProvider";
import WorkoutSessionScreenInner from "@/src/features/workouts/session/screens/WorkoutSessionScreenInner";

export default function WorkoutSessionScreen() {
  return (
    <WorkoutSessionProvider>
      <WorkoutSessionScreenInner />
    </WorkoutSessionProvider>
  );
}
