# Pick a Workout Day When Starting a Session — Design

## Problem

Starting a workout always auto-picks whatever the active plan has scheduled for *today* (`useHandleStartWorkout` → `createSession(userId)` → `getWorkoutIDForDay(planId, today)`). There is no way to start a different workout from the active plan — e.g. catching up on a missed day, or doing tomorrow's session early.

## Goals

- Let the user start any workout belonging to their active plan, not just today's.
- Keep the existing one-tap "Start Workout" fast path for today's workout unchanged.
- Reuse existing data/services; no new tables or sync payload shape.

## Non-goals

- No "makeup session" flag or distinct history treatment — a session started from a picked day is recorded exactly like a normal session (real `startedAt`, today's date for streaks).
- No cross-plan picking — only the active plan's workouts are offered.
- No day-of-week grid UI — the picker lists workouts by name (plan's existing `WorkoutCard`/`DayChips` visual language), not a 7-day grid.

## Design

### `createSession(userId, workoutId?)`

`src/features/workouts/session/services/createSession.ts` gains an optional second parameter. When `workoutId` is supplied, it's used directly (via `getWorkoutById`), skipping the `getWorkoutIDForDay` lookup. When omitted, behavior is unchanged (today's scheduled workout). Everything downstream — exercise/set snapshotting, `startedAt = now`, outbox payload — is identical either way, since a picked-day session is recorded exactly like a normal one.

### `useStartWorkout` (renamed from `useHandleStartWorkout`)

`src/features/home/hooks/useHandleStartWorkout.ts` → `useStartWorkout.ts`. Returns `startWorkout(workoutId?: string)` instead of a zero-arg `handleStartWorkout`. Behavior:
- If there's an active session, navigate to it (ignore `workoutId` — you can't switch what an in-progress session is doing).
- Otherwise call `createSession(user?.id ?? null, workoutId)` and navigate to the new session.

The Home screen's main button calls `startWorkout()` (today's workout, unchanged). The new picker calls `startWorkout(workout.id)`.

### `useWorkoutPicker` hook

New: `src/features/home/hooks/useWorkoutPicker.ts`. Owns modal visibility and the active plan's workout list (via `usePlans()` + `useGetActivePlan()`, same lookup `PlanDetailScreen` already performs — `plans.find(p => p.id === activePlanId)?.workouts ?? []`). Exposes `{ visible, open, close, workouts, pickWorkout }` where `pickWorkout(workout)` calls `startWorkout(workout.id)` then `close()`.

### `WorkoutPickerModal` component

New: `src/features/home/components/WorkoutPickerModal.tsx`. Same `Modal` slide-up-sheet pattern as `ExercisesListSheet` (transparent, slide animation, dark overlay, rounded sheet). Lists every workout in the active plan: name + its scheduled day(s) as a small day-chip row (reusing the single-letter `DAY_LABELS` and chip styling from `PlanDetailScreen`'s `DayChips`). Tapping a row calls `pickWorkout(workout)`.

### `HomeScreen` wiring

A small text affordance ("Change day") sits below/next to the `ActionButton`. Visible only when the button is in its plain "Start Workout" state:

```
activePlanId && workouts.length > 0 && !activeSession && !showFinished
```

(mirrors the existing `hasActiveSession` / `showFinished` / `hasNoActivePlan` conditions already computed for the button). Hidden entirely otherwise — no disabled state, per the "hide it entirely" decision.

## Data flow

```
HomeScreen
 ├─ useGetActiveSession() / useHasFinishedWorkoutToday()  (existing, unchanged)
 ├─ useStartWorkout() → startWorkout(workoutId?)
 └─ useWorkoutPicker() → { visible, open, close, workouts, pickWorkout }
       └─ WorkoutPickerModal (visible, workouts, onPick=pickWorkout, onClose=close)
```

## Testing

No test suite is configured in this project (per `CLAUDE.md`). Verification is manual: run the app, confirm the affordance shows/hides correctly across active-session/finished/no-plan/rest-day states, and confirm picking a non-today workout starts a session with that workout's exercises.
