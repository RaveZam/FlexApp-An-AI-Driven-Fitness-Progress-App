# Exercise History Modal Design

## Purpose

Tapping an `ExerciseCard` on Home (Progressive Overload section) opens a modal showing an enlarged, tappable version of that exercise's chart, plus a detail panel with the date and exact sets hit for whichever session is selected — mirroring the per-set detail already shown in `SessionDetailScreen`, scoped to a single exercise.

## Components

### 1. Shared chart (`src/features/home/components/ProgressiveOverload/ProgressionChart.tsx`)

Extracted from the chart JSX currently inlined in `ExerciseCard.tsx` (grid lines, `ProgressionBar`s, trend polyline/dots). New props:

```ts
type Props = {
  points: ExercisePoint[];
  selectedIndex?: number | null;
  onSelectIndex?: (index: number) => void;
};
```

When `onSelectIndex` is provided, each bar is wrapped in a `Pressable` (same tap-to-select pattern as `Last7SessionsPanel`'s `HistoryBar`) and the selected bar gets a highlight state. When omitted, renders exactly as today (non-interactive). `ExerciseCard` switches to this component with no interactive props — visual output unchanged.

### 2. DAO (`src/lib/dao/exerciseStats.ts`)

New `listSessionSetsForExercise(userId, sessionId, exerciseName)`:

```sql
SELECT ss.set_index, ss.target_reps, ss.actual_reps,
       ss.actual_reps_left, ss.actual_reps_right,
       ss.weight, ss.completed
FROM session_sets ss
JOIN session_exercises se ON ss.session_exercise_id = se.id
JOIN workout_sessions ws ON se.session_id = ws.id
WHERE ws.user_id = ? AND ws.id = ? AND se.name = ?
ORDER BY ss.set_index ASC
```

Same join shape and `se.name` matching convention as `listRecentTopSetsByUser`. Returns every set for that exercise in that session, not just the top set.

### 3. Hook (`src/features/home/hooks/ProgressiveOverload/useExerciseSessionSets.ts`)

```ts
function useExerciseSessionSets(sessionId: string | null, exerciseName: string): {
  sets: SessionSetDetail[]; // set_index, reps, weight, completed
}
```

Re-queries `listSessionSetsForExercise` whenever `sessionId` changes. `sessionId: null` (nothing selected yet) returns `[]`. Same shape as `useSessionDetail` / `useGetSessionSets`.

### 4. Modal (`src/features/home/components/ProgressiveOverload/ExerciseHistoryModal.tsx`)

RN `Modal`, styled consistent with `WorkoutLogModal`/`RestTimerModal` (dark backdrop, rounded sheet, close button). Props: `visible`, `exercise: ExerciseProgress`, `onClose`.

Layout:
- Header: exercise name + close (`Feather "x"`, matches existing icon usage) button.
- `ProgressionChart` (interactive) rendered from `exercise.points` — no fetch needed, reuses data already loaded by `useProgressiveOverload`.
- Detail panel below: selected session's formatted date (`toLocaleDateString`, matching `Last7SessionsPanel`'s date formatting) + a set-by-set list (set #, reps, weight, completed check) styled after `SessionDetailScreen`'s `SetRow`.

Internal state: `selectedIndex`, initialized to `points.length - 1` (latest) whenever the modal opens (reset on `visible` transitioning false → true, and whenever `exercise.name` changes). Tapping a bar updates `selectedIndex`; the panel re-derives `sessionId = points[selectedIndex].sessionId` and calls `useExerciseSessionSets(sessionId, exercise.name)`.

### 5. Wiring (`ExerciseCard.tsx`)

Card's outer `ReAnimated.View` becomes a `Pressable` (wrapping the existing content, no visual change) that sets local `modalVisible` state to `true`. Renders `<ExerciseHistoryModal visible={modalVisible} exercise={exercise} onClose={() => setModalVisible(false)} />` alongside.

## Data Flow

1. Card tap → `modalVisible = true`.
2. Modal mounts/opens → `selectedIndex` defaults to latest point → `useExerciseSessionSets` fires for that session immediately.
3. Chart renders from `exercise.points` (already in memory, last-7 window, same as the card).
4. Tap a different bar → `selectedIndex` updates → hook re-queries → panel updates with that session's date + sets.
5. `onClose` → `modalVisible = false`. Selection state lives inside the modal component and re-initializes to "latest" on next open, so no explicit reset wiring is needed from the parent.

## Empty/Error Handling

- `listSessionSetsForExercise` returning `[]` (shouldn't happen since every point comes from a real logged set, but guards against a data edge case) → panel shows "No sets recorded" text instead of an empty list.
- No loading state needed for the per-session query — it's a single indexed synchronous SQLite read, same as the rest of the DAO layer (`useGetSessionSets`, `useSessionDetail`).

## Testing

No test suite is configured in this repo. Verification is manual: run the app, open Home, tap an `ExerciseCard`, confirm the modal's chart matches the card's chart, tap through several bars and confirm the detail panel updates to the correct date/sets each time, close and reopen to confirm it resets to the latest session.

## Out of Scope

- Fetching history beyond the existing last-7-sessions window.
- Editing sets from within the modal (read-only view).
- Cross-exercise session context (i.e. showing other exercises done in the same session) — deliberately scoped to just the tapped exercise, per the "just this exercise's sets" decision.
