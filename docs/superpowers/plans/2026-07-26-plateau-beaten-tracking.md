# Plateau Beaten-Status Tracking Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Persist plateau instances across checks so that when an exercise's top set finally beats the weight/reps it was stuck at, the plateau is marked `beaten` instead of just silently vanishing from the active list.

**Architecture:** A new local-only SQLite table (`plateau_records`) stores one row per detected plateau instance, keyed on `(user_id, exercise_name, weight, reps)`. A pure reconciliation function compares the current `detectPlateaus` output and each exercise's current best set against the previously-persisted rows, producing two lists: newly-detected plateaus to insert, and previously-active plateaus now beaten to update. `usePlateauTracker`'s existing load cycle calls this reconciliation and writes the results — no UI changes.

**Tech Stack:** TypeScript, Expo SQLite (`expo-sqlite`), no test runner configured in this repo (verify pure logic with a throwaway `tsx` script; verify DB/service code by running the app).

## Global Constraints

- No test suite is configured in this repo (per `CLAUDE.md`) — there is no `jest`/`vitest` to add specs to. Verify pure functions with a temporary script run via `npx tsx` (deleted before commit, never committed). Verify SQLite-touching code by running the app (`npm start`) since `expo-sqlite` requires the native/Expo runtime.
- `plateau_records` is local-only: never enqueued to the outbox, never synced to Supabase (matches `plateau_tips`).
- Path alias `@/*` resolves to project root; strict TypeScript mode is on — all new code must typecheck under `npx tsc --noEmit`.
- Screens stay UI-only; this plan touches no screen/component files (no UI changes in scope), only `core/`, `services/`, and one `hooks/` file, per `src/features/workouts`-style layering conventions already used elsewhere in `src/features/home`.

---

### Task 1: Extract `computeBest` helper in `detectPlateaus.ts`

**Files:**
- Modify: `src/features/home/core/detectPlateaus.ts`

**Interfaces:**
- Produces: `export function computeBest(points: ExercisePoint[]): { weight: number; reps: number }` — used by Task 2's reconciliation logic and internally by `detectPlateaus`.

- [ ] **Step 1: Extract the running-best scan into `computeBest`, keep `detectPlateaus` behavior identical**

Replace the body of `detectPlateaus.ts` with:

```ts
import type { ExercisePoint, ExerciseProgress } from "@/src/features/home/types/progressiveOverload";

export type PlateauResult = {
  name: string;
  muscleGroup: string | null;
  weight: number;
  reps: number;
  sessionsStuck: number;
  lastImprovedAt: string | null;
};

const DEFAULT_THRESHOLD = 3;

function isPR(point: ExercisePoint, best: { weight: number; reps: number }): boolean {
  if (point.weight > best.weight) return true;
  if (point.weight === best.weight && point.reps > best.reps) return true;
  return false;
}

// Running best (weight, reps) across an exercise's chronological points,
// using the same PR rule detectPlateaus uses to find the plateau ceiling.
// Shared with reconcilePlateauRecords so "beaten" uses the identical rule.
export function computeBest(points: ExercisePoint[]): { weight: number; reps: number } {
  let best = { weight: 0, reps: 0 };
  for (const point of points) {
    if (isPR(point, best)) {
      best = { weight: point.weight, reps: point.reps };
    }
  }
  return best;
}

function lastImprovementAt(points: ExercisePoint[]): string | null {
  let best = { weight: 0, reps: 0 };
  let lastImprovedAt: string | null = null;
  for (const point of points) {
    if (isPR(point, best)) {
      best = { weight: point.weight, reps: point.reps };
      lastImprovedAt = point.completedAt;
    }
  }
  return lastImprovedAt;
}

// An exercise "plateaus" when its last `threshold` sessions produced no new
// PR on its top set (heavier weight, or same weight with more reps). Needs
// at least threshold+1 sessions of history so the first session's trivial
// PR can't itself count toward the stuck streak.
export function detectPlateaus(
  exercises: ExerciseProgress[],
  threshold: number = DEFAULT_THRESHOLD,
): PlateauResult[] {
  const results: PlateauResult[] = [];

  for (const exercise of exercises) {
    const { points } = exercise;
    if (points.length < threshold + 1) continue;

    let best = { weight: 0, reps: 0 };
    const prFlags: boolean[] = [];

    for (const point of points) {
      const pr = isPR(point, best);
      prFlags.push(pr);
      if (pr) {
        best = { weight: point.weight, reps: point.reps };
      }
    }

    const lastN = prFlags.slice(-threshold);
    const plateaued = lastN.every((pr) => !pr);
    if (!plateaued) continue;

    results.push({
      name: exercise.name,
      muscleGroup: exercise.muscleGroup,
      weight: best.weight,
      reps: best.reps,
      sessionsStuck: threshold,
      lastImprovedAt: lastImprovementAt(points),
    });
  }

  return results;
}
```

Note: this restructure computes the best-tracking loop twice (once inline for the plateau streak check, once in `lastImprovementAt`) rather than once — this is intentional to keep `computeBest` a clean, single-purpose export with no side channel for "last improvement timestamp," which only `detectPlateaus` needs. Both loops are O(points.length) over at most ~10 points, so the duplication has no meaningful cost.

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no new errors introduced by this file.

- [ ] **Step 3: Verify behavior is unchanged with a throwaway script**

Create `/tmp/verify-detect-plateaus.ts` (not committed):

```ts
import { detectPlateaus, computeBest } from "/Users/raven/Projects/FlexApp/src/features/home/core/detectPlateaus";

const points = [
  { sessionId: "1", completedAt: "2026-01-01", weight: 100, reps: 8 },
  { sessionId: "2", completedAt: "2026-01-08", weight: 100, reps: 8 },
  { sessionId: "3", completedAt: "2026-01-15", weight: 100, reps: 8 },
  { sessionId: "4", completedAt: "2026-01-22", weight: 100, reps: 8 },
];

const exercises = [{ name: "Bench Press", muscleGroup: "Chest", points }];

const plateaus = detectPlateaus(exercises);
console.assert(plateaus.length === 1, "expected 1 plateau");
console.assert(plateaus[0].weight === 100 && plateaus[0].reps === 8, "expected stuck at 100x8");

const best = computeBest(points);
console.assert(best.weight === 100 && best.reps === 8, "expected computeBest to match plateau ceiling");

console.log("OK");
```

Run: `npx tsx /tmp/verify-detect-plateaus.ts`
Expected output: `OK` with no assertion failures printed above it.

Delete the script afterward: `rm /tmp/verify-detect-plateaus.ts`

- [ ] **Step 4: Commit**

```bash
git add src/features/home/core/detectPlateaus.ts
git commit -m "Extract computeBest helper from detectPlateaus for reuse in reconciliation"
```

---

### Task 2: `reconcilePlateauRecords` core logic

**Files:**
- Create: `src/features/home/core/reconcilePlateauRecords.ts`

**Interfaces:**
- Consumes: `computeBest(points: ExercisePoint[])` and `PlateauResult` from Task 1's `detectPlateaus.ts`; `ExerciseProgress` from `src/features/home/types/progressiveOverload.ts`.
- Produces:
  - `export type PlateauRecordRow = { exerciseName: string; weight: number; reps: number; status: "active" | "beaten" }`
  - `export type PlateauReconciliation = { toActivate: PlateauResult[]; toBeat: { exerciseName: string; weight: number; reps: number }[] }`
  - `export function reconcilePlateauRecords(exercises: ExerciseProgress[], currentPlateaus: PlateauResult[], activeRecords: PlateauRecordRow[]): PlateauReconciliation`
  - Consumed by Task 5's `usePlateauTracker.ts`.

- [ ] **Step 1: Write the implementation**

```ts
import type { PlateauResult } from "@/src/features/home/core/detectPlateaus";
import { computeBest } from "@/src/features/home/core/detectPlateaus";
import type { ExerciseProgress } from "@/src/features/home/types/progressiveOverload";

export type PlateauRecordRow = {
  exerciseName: string;
  weight: number;
  reps: number;
  status: "active" | "beaten";
};

export type PlateauReconciliation = {
  toActivate: PlateauResult[];
  toBeat: { exerciseName: string; weight: number; reps: number }[];
};

function matches(a: { exerciseName: string; weight: number; reps: number }, p: PlateauResult): boolean {
  return a.exerciseName === p.name && a.weight === p.weight && a.reps === p.reps;
}

// Compares detectPlateaus's current output and each exercise's live best set
// against previously-persisted plateau_records rows. A record is "beaten"
// when the exercise's current best exceeds the record's stored ceiling,
// checked directly rather than via membership in currentPlateaus, so a
// plateau aging out of the detection window isn't mistaken for beaten.
export function reconcilePlateauRecords(
  exercises: ExerciseProgress[],
  currentPlateaus: PlateauResult[],
  activeRecords: PlateauRecordRow[],
): PlateauReconciliation {
  const toActivate = currentPlateaus.filter(
    (p) => !activeRecords.some((r) => matches(r, p)),
  );

  const bestByExercise = new Map(
    exercises.map((e) => [e.name, computeBest(e.points)]),
  );

  const toBeat = activeRecords
    .filter((r) => {
      const best = bestByExercise.get(r.exerciseName);
      if (!best) return false;
      if (best.weight > r.weight) return true;
      if (best.weight === r.weight && best.reps > r.reps) return true;
      return false;
    })
    .map((r) => ({ exerciseName: r.exerciseName, weight: r.weight, reps: r.reps }));

  return { toActivate, toBeat };
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Verify with a throwaway script**

Create `/tmp/verify-reconcile.ts` (not committed):

```ts
import { reconcilePlateauRecords } from "/Users/raven/Projects/FlexApp/src/features/home/core/reconcilePlateauRecords";
import type { PlateauResult } from "/Users/raven/Projects/FlexApp/src/features/home/core/detectPlateaus";

const exercises = [
  {
    name: "Bench Press",
    muscleGroup: "Chest",
    points: [
      { sessionId: "1", completedAt: "2026-01-01", weight: 100, reps: 8 },
      { sessionId: "2", completedAt: "2026-01-08", weight: 105, reps: 8 }, // new PR
    ],
  },
  {
    name: "Squat",
    muscleGroup: "Legs",
    points: [
      { sessionId: "1", completedAt: "2026-01-01", weight: 150, reps: 5 },
    ],
  },
];

const currentPlateaus: PlateauResult[] = [
  { name: "Squat", muscleGroup: "Legs", weight: 150, reps: 5, sessionsStuck: 3, lastImprovedAt: null },
];

const activeRecords = [
  { exerciseName: "Bench Press", weight: 100, reps: 8, status: "active" as const },
  { exerciseName: "Squat", weight: 150, reps: 5, status: "active" as const },
];

const { toActivate, toBeat } = reconcilePlateauRecords(exercises, currentPlateaus, activeRecords);

console.assert(toActivate.length === 0, "Squat already has an active record, should not re-activate");
console.assert(toBeat.length === 1 && toBeat[0].exerciseName === "Bench Press", "Bench Press should be beaten (105 > 100)");

// New plateau with no prior record
const { toActivate: activate2 } = reconcilePlateauRecords(
  exercises,
  [{ name: "Bench Press", muscleGroup: "Chest", weight: 105, reps: 8, sessionsStuck: 3, lastImprovedAt: null }],
  [],
);
console.assert(activate2.length === 1 && activate2[0].name === "Bench Press", "new plateau should be activated");

console.log("OK");
```

Run: `npx tsx /tmp/verify-reconcile.ts`
Expected output: `OK` with no assertion failures printed above it.

Delete the script afterward: `rm /tmp/verify-reconcile.ts`

- [ ] **Step 4: Commit**

```bash
git add src/features/home/core/reconcilePlateauRecords.ts
git commit -m "Add reconcilePlateauRecords to diff plateau state against persisted records"
```

---

### Task 3: `plateau_records` table migration

**Files:**
- Modify: `src/lib/db.ts`

**Interfaces:**
- Produces: `plateau_records` SQLite table, consumed by Task 4's `plateauRecordsLocalService.ts`.

- [ ] **Step 1: Add the table to `initDb`'s schema block**

In `src/lib/db.ts`, add immediately after the existing `plateau_tips` table (currently ending at line 129, right before the `-- Indexes` comment):

```sql
    CREATE TABLE IF NOT EXISTS plateau_records (
      user_id TEXT NOT NULL,
      exercise_name TEXT NOT NULL,
      muscle_group TEXT,
      weight REAL NOT NULL,
      reps INTEGER NOT NULL,
      sessions_stuck INTEGER NOT NULL,
      status TEXT NOT NULL CHECK (status IN ('active','beaten')) DEFAULT 'active',
      detected_at TEXT NOT NULL,
      beaten_at TEXT,
      PRIMARY KEY (user_id, exercise_name, weight, reps)
    );
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors (this is a template-string change, but confirms nothing else broke).

- [ ] **Step 3: Verify the table is created by running the app**

Run: `npm start`, open the app in a simulator/device, let it fully load (this runs `initDb()` on startup). Then stop the app.

There is no in-app DB browser in this project, so confirm via the Expo dev server logs that no SQLite error was thrown during startup (a malformed `CREATE TABLE` statement would throw and surface as a red-box/crash on launch, not a silent failure). If the app launches cleanly to the home screen, the migration ran successfully.

- [ ] **Step 4: Commit**

```bash
git add src/lib/db.ts
git commit -m "Add plateau_records table for tracking plateau active/beaten status"
```

---

### Task 4: `plateauRecordsLocalService.ts`

**Files:**
- Create: `src/features/home/services/plateauRecordsLocalService.ts`

**Interfaces:**
- Consumes: `getDb()` from `@/src/lib/db`; `PlateauResult` from `@/src/features/home/core/detectPlateaus`; `PlateauRecordRow` from `@/src/features/home/core/reconcilePlateauRecords`.
- Produces:
  - `export function listActiveRecords(userId: string): PlateauRecordRow[]`
  - `export function insertActive(userId: string, plateau: PlateauResult, detectedAt: string): void`
  - `export function markBeaten(userId: string, exerciseName: string, weight: number, reps: number, beatenAt: string): void`
  - Consumed by Task 5's `usePlateauTracker.ts`.

- [ ] **Step 1: Write the implementation**

```ts
import type { PlateauResult } from "@/src/features/home/core/detectPlateaus";
import type { PlateauRecordRow } from "@/src/features/home/core/reconcilePlateauRecords";
import { getDb } from "@/src/lib/db";

export function listActiveRecords(userId: string): PlateauRecordRow[] {
  const db = getDb();
  return db.getAllSync<PlateauRecordRow>(
    `SELECT exercise_name as exerciseName, weight, reps, status
     FROM plateau_records WHERE user_id = ? AND status = 'active'`,
    [userId],
  );
}

export function insertActive(
  userId: string,
  plateau: PlateauResult,
  detectedAt: string,
): void {
  const db = getDb();
  db.runSync(
    `INSERT OR REPLACE INTO plateau_records
       (user_id, exercise_name, muscle_group, weight, reps, sessions_stuck, status, detected_at, beaten_at)
     VALUES (?, ?, ?, ?, ?, ?, 'active', ?, NULL)`,
    [
      userId,
      plateau.name,
      plateau.muscleGroup,
      plateau.weight,
      plateau.reps,
      plateau.sessionsStuck,
      detectedAt,
    ],
  );
}

export function markBeaten(
  userId: string,
  exerciseName: string,
  weight: number,
  reps: number,
  beatenAt: string,
): void {
  const db = getDb();
  db.runSync(
    `UPDATE plateau_records SET status = 'beaten', beaten_at = ?
     WHERE user_id = ? AND exercise_name = ? AND weight = ? AND reps = ? AND status = 'active'`,
    [beatenAt, userId, exerciseName, weight, reps],
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/features/home/services/plateauRecordsLocalService.ts
git commit -m "Add plateauRecordsLocalService for reading/writing plateau_records"
```

---

### Task 5: Wire reconciliation into `usePlateauTracker`

**Files:**
- Modify: `src/features/home/hooks/usePlateauTracker.ts`

**Interfaces:**
- Consumes: `reconcilePlateauRecords` (Task 2), `listActiveRecords` / `insertActive` / `markBeaten` (Task 4).
- No changes to the hook's public return shape (`{ plateaus: PlateauWithTip[] }`) — this task is a side-effect-only addition.

- [ ] **Step 1: Add the reconciliation call inside `load()`**

In `src/features/home/hooks/usePlateauTracker.ts`, update the imports and `load` callback:

```ts
import { useAuth } from "@/src/features/auth";
import {
  detectPlateaus,
  type PlateauResult,
} from "@/src/features/home/core/detectPlateaus";
import { reconcilePlateauRecords } from "@/src/features/home/core/reconcilePlateauRecords";
import { toExerciseProgress } from "@/src/features/home/core/toExerciseProgress";
import {
  insertActive,
  listActiveRecords,
  markBeaten,
} from "@/src/features/home/services/plateauRecordsLocalService";
import { listLoggedWorkouts } from "@/src/features/home/services/ProgressiveOverloadDao/progressiveOverloadDao";
import { getTip } from "@/src/features/home/services/plateauSuggestionService";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";

// How many plateau we will detect
const DETECTION_LIMIT = 10;

export type PlateauWithTip = PlateauResult & { tip: string | null };

function tipKey(p: PlateauResult): string {
  return `${p.name}|${p.weight}|${p.reps}`;
}

export function usePlateauTracker(): { plateaus: PlateauWithTip[] } {
  const { userId } = useAuth();

  const [plateaus, setPlateaus] = useState<PlateauResult[]>([]);

  //This finds the plateaued workouts, then reconciles active/beaten status
  //against previously-persisted plateau_records rows
  const load = useCallback(() => {
    if (!userId) {
      setPlateaus([]);
      return;
    }
    const exercises = toExerciseProgress(
      listLoggedWorkouts(userId, DETECTION_LIMIT),
    );
    const currentPlateaus = detectPlateaus(exercises);
    setPlateaus(currentPlateaus);

    const activeRecords = listActiveRecords(userId);
    const { toActivate, toBeat } = reconcilePlateauRecords(
      exercises,
      currentPlateaus,
      activeRecords,
    );
    const now = new Date().toISOString();
    for (const p of toActivate) {
      insertActive(userId, p, now);
    }
    for (const r of toBeat) {
      markBeaten(userId, r.exerciseName, r.weight, r.reps, now);
    }
  }, [userId]);

  useFocusEffect(load);

  const [tips, setTips] = useState<Record<string, string | null>>({});

  //This resets the tips when the user changes
  useEffect(() => {
    setTips({});
  }, [userId]);

  //This fetches the tips for the plateaued workouts, returns cached if there is, if not query for one and set it
  useEffect(() => {
    if (!userId) return;

    for (const p of plateaus) {
      const key = tipKey(p);
      setTips((prev) => (key in prev ? prev : { ...prev, [key]: null }));

      getTip(userId, p).then((tip) => {
        if (tip) setTips((prev) => ({ ...prev, [key]: tip }));
      });
    }
  }, [userId, plateaus]);

  //This adds the tips to the plateaued workouts
  const withTips: PlateauWithTip[] = plateaus.map((p) => ({
    ...p,
    tip: tips[tipKey(p)] ?? null,
  }));

  return { plateaus: withTips };
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Verify end-to-end by running the app**

Run: `npm start`, open the app, log in as a user with at least one exercise that has 4+ logged sessions all at the same weight/reps (so `detectPlateaus` flags it) — reuse whatever test data was used to verify the original plateau tracker feature, or log a few matching sessions via the app's normal workout flow if none exist.

1. Load the Home screen. Confirm the `PlateauCard` still renders the plateau exactly as before (no UI regression) — this is the observable proof that `load()` didn't throw.
2. Add a temporary `console.log(JSON.stringify(listActiveRecords(userId)))` right after the `insertActive` loop in `usePlateauTracker.ts`, reload the Home screen, and confirm in the Metro/Expo logs that a row with `status: "active"` appears for that exercise.
3. Log a new session for that exercise with a heavier weight (a genuine PR). Reload the Home screen again and confirm in the logs that `listActiveRecords` no longer includes that exercise (it flipped to `beaten`), and that the `PlateauCard` no longer shows it (unchanged prior behavior).
4. Remove the temporary `console.log` before committing.

- [ ] **Step 4: Commit**

```bash
git add src/features/home/hooks/usePlateauTracker.ts
git commit -m "Reconcile plateau active/beaten status on every plateau tracker load"
```

---

## Out of Scope (carried over from the design doc)

- Any UI surfacing of beaten plateaus (badge, history list, celebration).
- Syncing `plateau_records` to Supabase.
- Notifications/toasts when a plateau is beaten.
