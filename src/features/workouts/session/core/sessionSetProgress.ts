import type { SessionSetRow } from "@/src/lib/dao/sessionSets";

// The current set is the first unlogged one; -1 / null when every set is done.
export function currentSetIndex(sets: SessionSetRow[]): number {
  return sets.findIndex((s) => !s.completed);
}

export function currentSet(sets: SessionSetRow[]): SessionSetRow | null {
  const i = currentSetIndex(sets);
  return i === -1 ? null : sets[i];
}
