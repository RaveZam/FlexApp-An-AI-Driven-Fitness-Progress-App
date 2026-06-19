# Render planned sets for the active exercise

**Date:** 2026-06-19
**Status:** Approved
**Scope:** Rendering slice only — first step of re-implementing the set log feature.

## Problem

The recent refactor to the `session_exercises` / `session_sets` snapshot model
(commits `2bfede2`, `48317cc`) tore out the set-logging UI. The sets section in
`WorkoutSessionScreenInner` is commented out (lines 97–113), `progressPct` is
hardcoded to `50`, and no hook feeds set rows into the screen.

The data layer is intact: `createSession` writes one empty `session_set` per
target set (`weight`/`actual_reps` NULL, `completed` 0, with `set_index` +
`target_reps`), and `listSessionSetsByExercise` reads them back.

This spec covers only the **first step**: read the active exercise's planned
`session_set` rows and render them below the "Now Lifting" card, each showing its
target reps. Read-only — no logging.

## Out of scope (later brainstorms)

- Tapping a set row to log it. (Decision already carried forward: tapping an
  unlogged/current row opens the existing `WorkoutLogModal`.)
- `updateSessionSet` writes + `enqueueOutbox` on log.
- Real `progressPct`, completion cards, advancing to the next exercise.

## Design

### Data flow

`WorkoutSessionProvider` already exposes `exercises` and `activeIndex`. The active
exercise's id (`exercises[activeIndex].id`) is the `session_exercise_id` whose sets
we render.

### 1. Hook — `useGetSessionSets`

`src/features/workouts/session/hooks/useGetSessionSets.tsx`

```ts
export function useGetSessionSets(sessionExerciseId: string): SessionSetRow[]
```

Wraps `listSessionSetsByExercise(sessionExerciseId)`, memoized on the id. Mirrors
the existing `useGetCompletedSetCount`. (Refresh-on-write is a logging-step
concern; not needed here since sets don't change in this slice.)

### 2. Component — `SessionSetList`

`src/features/workouts/session/components/SessionSetList.tsx`

Self-sources its data, matching the codebase's current direction where each piece
pulls its own data (`SessionExerciseCard`, `ExerciseRow`) and screens stay UI-only:

- `const { exercises, activeIndex } = useWorkoutSession();`
- `const active = exercises[activeIndex];`
- `const sets = useGetSessionSets(active.id);`
- Renders a header (`Sets` label + `{completed} / {sets.length}` counter, where
  `completed` is the count of `s.completed` rows — `0` in this slice) and maps
  `sets` to `SetRow`.

**Current-set marker:** the first incomplete set is `isCurrent`, the rest are
future:

```ts
const currentIndex = sets.findIndex((s) => !s.completed);
// ...
<SetRow ... isCurrent={index === currentIndex} index={index} />
```

In this slice nothing is logged, so set 0 renders as current and the rest as
future. This is a single inline expression and sets up the logging step cleanly.

### 3. Screen — `WorkoutSessionScreenInner`

Replace the commented-out block (lines 97–113) with `<SessionSetList />` below
`<SessionExerciseCard />`, keyed on `focusKey` so its entrance animation replays
on refocus like the siblings. Move the `setsHeader` / `setsContainer` /
`sectionLabel` / `setsCounter` styles into `SessionSetList`; delete them from the
screen.

### 4. Type fix — `SetRow`

Retype `SetRow`'s `set` prop from `SessionSetView` (`sessionView.ts`) to
`SessionSetRow` (the DAO type). `SetRow` already reads only `id`, `weight`,
`actualReps`, `actualRepsLeft/Right`, `targetReps`, `completed` — all present on
`SessionSetRow`; `setIndex` is used for the animation-key offset. This removes the
view/row field mismatch (`setNumber` vs `setIndex`). `SessionSetView` may remain
unused for now and be cleaned up in a later step.

## Files

| File | Change |
|---|---|
| `session/hooks/useGetSessionSets.tsx` | new — read active exercise's sets |
| `session/components/SessionSetList.tsx` | new — header + `SetRow` list, self-sourced |
| `session/screens/WorkoutSessionScreenInner.tsx` | replace commented block with `SessionSetList`; remove dead styles |
| `session/components/SetRow.tsx` | retype `set` prop to `SessionSetRow` |

## Verification

Start a session with a workout that has exercises/sets. The active exercise's card
shows below it: a `Sets` header with `0 / N`, and N rows each showing a dash for
weight and the target reps, with the first row highlighted as current.
