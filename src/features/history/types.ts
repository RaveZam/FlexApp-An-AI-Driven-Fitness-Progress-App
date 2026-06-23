import type { SessionStatus } from "@/src/lib/dao/sessions";

export type WorkoutSessionSummary = {
  id: string;
  name: string;
  status: SessionStatus;
  startedAt: string;
  completedAt: string;
  exerciseCount: number;
  completedSetCount: number;
  totalSetCount: number;
  volume: number;
};
