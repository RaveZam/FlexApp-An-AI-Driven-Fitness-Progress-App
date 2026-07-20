# Plateau Tracker Design

## Purpose

Detect exercises where the user's top set hasn't improved in a while, surface it on Home, and give a short AI-generated coaching tip on how to break through it.

## Plateau Definition

An exercise is "plateaued" when its last 3 completed sessions produced no new PR on its top set, where a PR is either:
- a heavier weight than any prior session, or
- the same weight with more reps than any prior session at that weight

This mirrors the "top set per session" reduction the existing `ProgressiveOverload` feature already does over `session_sets` — same source data, different reduction.

Not enough history (fewer than 4 logged sessions for that exercise) means "not evaluated," not "plateaued."

## Components

### 1. Detection (pure, `src/features/home/core/detectPlateaus.ts`)

```ts
type PlateauResult = {
  name: string;
  muscleGroup: string | null;
  weight: number;
  reps: number;
  sessionsStuck: number; // consecutive non-PR sessions, e.g. 3
  lastImprovedAt: string | null; // completedAt of the last PR session
};

function detectPlateaus(
  exercises: ExerciseProgress[], // existing type from progressiveOverload.ts
  threshold = 3,
): PlateauResult[];
```

Walks each exercise's `points` (already chronological, oldest first) tracking a running best `{weight, reps}`. A point is a PR if it beats the running best on weight, or matches weight with more reps. An exercise plateaus if its last `threshold` points are all non-PRs.

### 2. Data supply

Reuse `listLoggedWorkouts(userId, limit)` from `progressiveOverloadDao.ts`, called with a larger limit (12) than the chart's default (7) so infrequently-trained exercises still have enough sessions to evaluate. Reuse `toExerciseProgress` (currently private to `useProgressiveOverload.ts`) — export it so both hooks can call it, rather than duplicating the pivot logic.

### 3. Local cache table (`src/lib/db.ts`)

```sql
CREATE TABLE IF NOT EXISTS plateau_tips (
  user_id TEXT NOT NULL,
  exercise_name TEXT NOT NULL,
  weight REAL NOT NULL,
  reps INTEGER NOT NULL,
  tip TEXT NOT NULL,
  created_at TEXT NOT NULL,
  PRIMARY KEY (user_id, exercise_name, weight, reps)
);
```

Purely a derived cache — never written to the outbox, never synced to Supabase. Keying on the current stuck `(weight, reps)` means a new PR (which changes the running best) or a stall resuming at a different weight naturally invalidates the old tip and triggers a fresh AI call, with no explicit invalidation logic needed.

A new `plateauTipsLocalService.ts` in `src/features/home/services/` exposes `getCachedTip(userId, name, weight, reps)` and `saveCachedTip(...)`.

### 4. Hook (`src/features/home/hooks/usePlateauTracker.ts`)

On mount (Home screen):
1. Load sessions via `listLoggedWorkouts(user.id, 12)`, pivot via `toExerciseProgress`, run `detectPlateaus`.
2. For each result, look up `plateau_tips` by `(userId, name, weight, reps)`.
3. Cache hit → attach tip immediately.
4. Cache miss → return the row with `tip: null` (loading) and fire `supabase.functions.invoke('plateau-suggestion', {...})` asynchronously; on success, write to `plateau_tips` and update state; on failure, leave `tip: null` and do nothing further (see Error Handling).
5. Returns `{ plateaus: (PlateauResult & { tip: string | null })[] }`.

### 5. Supabase Edge Function (`supabase/functions/plateau-suggestion/index.ts`)

First edge function in this repo. Accepts `{ exerciseName, muscleGroup, weight, reps, sessionsStuck }`, calls the Gemini API server-side using a `GEMINI_API_KEY` secret (set via `supabase secrets set`, never committed, never in client code), and returns `{ tip: string }` — one short, actionable sentence. Short system prompt constrains length and tone (a lifting coach, not a wall of text).

### 6. UI (`src/features/home/components/PlateauCard.tsx`)

Added to the Home screen alongside the existing `Insights`/`ProgressiveOverload` cards. Per plateaued exercise: name, "stuck at {weight} lb × {reps} for {sessionsStuck} sessions," and the tip once loaded (subtle loading indicator while `tip === null`, matching the fade-in style already used elsewhere — see the ProgressiveOverload chart's transition). No card renders if there are no plateaus.

Screen stays UI-only; all of the above logic lives in the hook/service/core layers, per existing project convention.

## Error Handling

If the edge function call fails (offline, API error, malformed response), the row simply keeps `tip: null` — the card still shows the plateau badge without a tip, no error UI. Because nothing gets written to `plateau_tips` on failure, the next Home mount naturally retries. No explicit retry/backoff logic needed.

## Out of Scope

- On-device/local LLM inference — explicitly ruled out; cloud call via Supabase Edge Function is sufficient and much simpler.
- Auto-adjusting future workout targets based on plateau state.
- Manual on-demand "regenerate tip" button — can be added later if wanted.
- Historical plateau tracking/analytics (e.g. "you've plateaued 5 times on bench this year").
