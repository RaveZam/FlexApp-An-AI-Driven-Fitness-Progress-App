# Plateau Beaten-Status Tracking Design

## Purpose

`detectPlateaus` (see [[2026-07-20-plateau-tracker-design]]) is stateless: it recomputes the active plateau list from scratch every time, from the last `DETECTION_LIMIT` sessions. Once an exercise breaks through, it simply stops appearing in the results — nothing records that a plateau *was* beaten. This design adds persistence so a plateau's lifecycle (detected → beaten) can be tracked across checks, without changing any UI.

## Beaten Definition

A tracked plateau is "beaten" when the exercise's current best top set (heaviest weight, or same weight with more reps — the same PR rule `detectPlateaus` already uses) exceeds the `(weight, reps)` that were recorded as the plateau's ceiling at detection time. This is checked directly against the exercise's current best, not against membership in `detectPlateaus`'s output — so a plateau sliding out of the detection window (e.g. due to the session limit) is not mistaken for "beaten."

## Components

### 1. Data model (`src/lib/db.ts`)

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

Local-only, same as `plateau_tips` — never written to the outbox, never synced to Supabase. Keying on `(user_id, exercise_name, weight, reps)` means:
- A new plateau at a different weight/reps for the same exercise gets its own row (independent lifecycle).
- If an exercise plateaus again at the *exact* same weight/reps it previously beat, `INSERT OR REPLACE` naturally reactivates that row (`status` back to `'active'`, `detected_at` refreshed, `beaten_at` cleared) — no separate reactivation logic needed.

### 2. Core logic (pure, `src/features/home/core/detectPlateaus.ts` + new `reconcilePlateauRecords.ts`)

Extract the running-best scan already inside `detectPlateaus`'s loop into a small exported helper:

```ts
export function computeBest(points: ExercisePoint[]): { weight: number; reps: number };
```

New file `src/features/home/core/reconcilePlateauRecords.ts`:

```ts
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

export function reconcilePlateauRecords(
  exercises: ExerciseProgress[],
  currentPlateaus: PlateauResult[],
  activeRecords: PlateauRecordRow[],
): PlateauReconciliation;
```

- `toActivate`: entries in `currentPlateaus` with no matching row in `activeRecords` (matched on `exerciseName` + `weight` + `reps`) — these are newly-detected plateaus to persist.
- `toBeat`: rows in `activeRecords` whose exercise's `computeBest(points)` now exceeds the row's stored `(weight, reps)` — these get marked beaten regardless of whether they still appear in `currentPlateaus`.

### 3. Service (`src/features/home/services/plateauRecordsLocalService.ts`)

Mirrors `plateauTipsLocalService.ts`:
- `listActiveRecords(userId): PlateauRecordRow[]` — `SELECT ... WHERE user_id = ? AND status = 'active'`.
- `insertActive(userId, plateau: PlateauResult, detectedAt: string): void` — `INSERT OR REPLACE`, `status = 'active'`, `beaten_at = NULL`.
- `markBeaten(userId, exerciseName, weight, reps, beatenAt: string): void` — `UPDATE ... SET status = 'beaten', beaten_at = ? WHERE user_id = ? AND exercise_name = ? AND weight = ? AND reps = ? AND status = 'active'`.

### 4. Wiring (`src/features/home/hooks/usePlateauTracker.ts`)

Inside the existing `load()` callback, after `detectPlateaus` runs:

```ts
const activeRecords = listActiveRecords(userId);
const { toActivate, toBeat } = reconcilePlateauRecords(exercises, plateaus, activeRecords);
const now = new Date().toISOString();
toActivate.forEach((p) => insertActive(userId, p, now));
toBeat.forEach((r) => markBeaten(userId, r.exerciseName, r.weight, r.reps, now));
```

`plateaus` (the array driving `PlateauCard`) is unchanged — it's still exactly `detectPlateaus`'s output. This wiring only maintains the `plateau_records` table as a side effect; nothing in the UI changes.

## Out of Scope

- Any UI surfacing of beaten plateaus (badge, history list, celebration) — deferred; this design only builds the data model so that UI can be added later without a schema change.
- Syncing plateau records to Supabase.
- Notifications/toasts when a plateau is beaten.
