# Workout Day Picker Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let the user start any workout in their active plan from Home, not just today's scheduled one.

**Architecture:** `createSession` gains an optional `workoutId` override; `useHandleStartWorkout` is reshaped into `useStartWorkout` returning a `startWorkout(workoutId?)` function shared by the existing Start button and a new picker modal; a new `useWorkoutPicker` hook + `WorkoutPickerModal` component list the active plan's workouts and drive `startWorkout`.

**Tech Stack:** React Native (Expo Router), TypeScript strict mode, existing SQLite DAO layer, no test runner configured.

## Global Constraints

- No test suite exists (`CLAUDE.md`) — each task ends with manual verification via `npm run lint` / `npx tsc --noEmit`, not automated tests.
- Screens stay UI-only; logic lives in hooks (per project convention).
- Path alias `@/*` resolves to project root.

---

### Task 1: `createSession` accepts an optional workout override

**Files:**
- Modify: `src/features/workouts/session/services/createSession.ts:11-22`

**Interfaces:**
- Produces: `createSession(userId: string | null, workoutId?: string): string | null` — same return type/shape as before, callers passing only `userId` are unaffected.

- [ ] **Step 1: Change the signature and resolution logic**

Replace lines 11-22:

```ts
export default function createSession(userId: string | null, workoutId?: string) {
  if (!userId) return null;
  const planId = getActivePlanIdForUser(userId);

  if (!planId) return null;

  let resolvedWorkoutId = workoutId ?? null;
  if (!resolvedWorkoutId) {
    const today = new Date().getDay();
    resolvedWorkoutId = getWorkoutIDForDay(planId, today);
  }
  if (!resolvedWorkoutId) return null;

  const workout = getWorkoutById(resolvedWorkoutId);
  if (!workout) return null;
```

Then update the two remaining references to the old `workoutId` variable name later in the file (the `insertSession({ ... workoutId, ... })` call and the `enqueueOutbox({ ... payload: { ... workoutId, ... } })` call) to use `resolvedWorkoutId` instead:

- Line ~45 (`insertSession`): `workoutId: resolvedWorkoutId,`
- Line ~101 (`enqueueOutbox` payload): `workoutId: resolvedWorkoutId,`

- [ ] **Step 2: Verify with typecheck**

Run: `npx tsc --noEmit`
Expected: no new errors referencing `createSession.ts`.

- [ ] **Step 3: Commit**

```bash
git add src/features/workouts/session/services/createSession.ts
git commit -m "Let createSession start a specific workout instead of only today's"
```

---

### Task 2: Rename `useHandleStartWorkout` to `useStartWorkout` and accept a workout id

**Files:**
- Create: `src/features/home/hooks/useStartWorkout.ts`
- Delete: `src/features/home/hooks/useHandleStartWorkout.ts`
- Modify: `src/features/home/screens/HomeScreen.tsx:26,32,93` (import + call site)

**Interfaces:**
- Consumes: `createSession(userId, workoutId?)` from Task 1.
- Produces: `useStartWorkout(): (workoutId?: string) => void` — the returned function is what both the Start button and the picker call.

- [ ] **Step 1: Write the new hook**

Create `src/features/home/hooks/useStartWorkout.ts`:

```ts
import { getActiveSessionForUser } from "@/src/lib/dao/sessions";
import { router } from "expo-router";
import { useAuth } from "../../auth";
import createSession from "../../workouts/session/services/createSession";

export function useStartWorkout() {
  const { user } = useAuth();
  const activeSession = getActiveSessionForUser(user?.id ?? null);

  function startWorkout(workoutId?: string) {
    if (activeSession) {
      router.push(`/(tabs)/Workouts/session?id=${activeSession.id}` as any);
      return;
    }
    const sessionId = createSession(user?.id ?? null, workoutId);
    if (sessionId) {
      router.push(`/(tabs)/Workouts/session?id=${sessionId}` as any);
    }
  }

  return startWorkout;
}
```

- [ ] **Step 2: Delete the old hook file**

```bash
git rm src/features/home/hooks/useHandleStartWorkout.ts
```

- [ ] **Step 3: Update `HomeScreen.tsx`**

Change the import (line 26):

```ts
import { useStartWorkout } from "../hooks/useStartWorkout";
```

Change the hook call (line 32):

```ts
const startWorkout = useStartWorkout();
```

Change the button's `onPress` (line 93), replacing `onPress={handleStartWorkout}` with:

```tsx
onPress={() => startWorkout()}
```

- [ ] **Step 4: Verify with typecheck and lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: no errors; no remaining references to `useHandleStartWorkout` or `handleStartWorkout` (`grep -rn "useHandleStartWorkout\|handleStartWorkout" src app` returns nothing).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Reshaped the start-workout hook to accept an optional workout id"
```

---

### Task 3: `useWorkoutPicker` hook — active plan's workout list + modal state

**Files:**
- Create: `src/features/home/hooks/useWorkoutPicker.ts`

**Interfaces:**
- Consumes: `usePlans()` from `@/src/features/workouts/plan/hooks/usePlans` (returns `{ plans: WorkoutPlan[] }`), `useGetActivePlan()` (default export, returns `string | null`), `useStartWorkout()` from Task 2.
- Produces:
  ```ts
  function useWorkoutPicker(): {
    visible: boolean;
    open: () => void;
    close: () => void;
    workouts: Workout[];
    pickWorkout: (workout: Workout) => void;
  }
  ```
  `Workout` imported from `@/src/features/workouts` (has `.id`, `.name`, `.daysOfWeek`).

- [ ] **Step 1: Write the hook**

Create `src/features/home/hooks/useWorkoutPicker.ts`:

```ts
import { usePlans } from "@/src/features/workouts/plan/hooks/usePlans";
import type { Workout } from "@/src/features/workouts";
import { useState } from "react";
import useGetActivePlan from "./useGetActivePlan";
import { useStartWorkout } from "./useStartWorkout";

export function useWorkoutPicker() {
  const activePlanId = useGetActivePlan();
  const { plans } = usePlans();
  const startWorkout = useStartWorkout();
  const [visible, setVisible] = useState(false);

  const workouts: Workout[] =
    plans.find((p) => p.id === activePlanId)?.workouts ?? [];

  function open() {
    setVisible(true);
  }

  function close() {
    setVisible(false);
  }

  function pickWorkout(workout: Workout) {
    startWorkout(workout.id);
    close();
  }

  return { visible, open, close, workouts, pickWorkout };
}
```

- [ ] **Step 2: Verify with typecheck**

Run: `npx tsc --noEmit`
Expected: no errors referencing `useWorkoutPicker.ts`.

- [ ] **Step 3: Commit**

```bash
git add src/features/home/hooks/useWorkoutPicker.ts
git commit -m "Added a hook to list the active plan's workouts for the day picker"
```

---

### Task 4: `WorkoutPickerModal` component

**Files:**
- Create: `src/features/home/components/WorkoutPickerModal.tsx`

**Interfaces:**
- Consumes: `Workout` type (`.id`, `.name`, `.daysOfWeek: number[]`), `{ visible, workouts, onPick, onClose }` props.
- Produces: default export `WorkoutPickerModal`, used by `HomeScreen` in Task 5.

- [ ] **Step 1: Write the component**

Create `src/features/home/components/WorkoutPickerModal.tsx`:

```tsx
import { FontFamilies, Palette } from "@/constants/theme";
import type { Workout } from "@/src/features/workouts";
import { Ionicons } from "@expo/vector-icons";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const DAY_LABELS = ["S", "M", "T", "W", "Th", "F", "S"] as const;

type Props = {
  visible: boolean;
  workouts: Workout[];
  onPick: (workout: Workout) => void;
  onClose: () => void;
};

export default function WorkoutPickerModal({
  visible,
  workouts,
  onPick,
  onClose,
}: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>Choose a Workout</Text>
            <TouchableOpacity onPress={onClose} hitSlop={8}>
              <Ionicons name="close" size={22} color={Palette.bone} />
            </TouchableOpacity>
          </View>

          {workouts.map((workout) => (
            <TouchableOpacity
              key={workout.id}
              style={styles.row}
              activeOpacity={0.7}
              onPress={() => onPick(workout)}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.rowTitle}>{workout.name}</Text>
                <View style={styles.dayRow}>
                  {DAY_LABELS.map((label, i) => {
                    const on = workout.daysOfWeek.includes(i);
                    return (
                      <View
                        key={i}
                        style={[styles.dayChip, on && styles.dayChipOn]}
                      >
                        <Text
                          style={[styles.dayText, on && styles.dayTextOn]}
                        >
                          {label}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </View>
              <Ionicons
                name="chevron-forward"
                size={16}
                color={Palette.muted}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  sheet: {
    backgroundColor: Palette.inkRaised,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 32,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  title: {
    color: Palette.bone,
    fontSize: 15,
    fontFamily: FontFamilies.displayMedium,
    letterSpacing: -0.2,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Palette.hairline,
  },
  rowTitle: {
    color: Palette.bone,
    fontSize: 14,
    fontFamily: FontFamilies.displayMedium,
    marginBottom: 6,
  },
  dayRow: { flexDirection: "row", gap: 4 },
  dayChip: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Palette.inkSunken,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Palette.hairline,
  },
  dayChipOn: {
    backgroundColor: Palette.accent,
    borderColor: Palette.accent,
  },
  dayText: { color: Palette.muted, fontSize: 9, fontFamily: FontFamilies.medium },
  dayTextOn: { color: Palette.ink, fontFamily: FontFamilies.medium },
});
```

- [ ] **Step 2: Verify with typecheck**

Run: `npx tsc --noEmit`
Expected: no errors referencing `WorkoutPickerModal.tsx`.

- [ ] **Step 3: Commit**

```bash
git add src/features/home/components/WorkoutPickerModal.tsx
git commit -m "Added the workout picker sheet listing the active plan's workouts"
```

---

### Task 5: Wire the picker into `HomeScreen`

**Files:**
- Modify: `src/features/home/screens/HomeScreen.tsx`

**Interfaces:**
- Consumes: `useWorkoutPicker()` from Task 3, `WorkoutPickerModal` from Task 4.

- [ ] **Step 1: Add imports**

At the top of `HomeScreen.tsx`, alongside the existing hook imports, add:

```ts
import WorkoutPickerModal from "../components/WorkoutPickerModal";
import { useWorkoutPicker } from "../hooks/useWorkoutPicker";
```

- [ ] **Step 2: Call the hook and compute affordance visibility**

Inside `Index()`, after the existing `const showFinished = ...` line, add:

```ts
const {
  visible: pickerVisible,
  open: openPicker,
  close: closePicker,
  workouts: pickableWorkouts,
  pickWorkout,
} = useWorkoutPicker();

const canChangeDay =
  !isRestDay && !activeSession && !showFinished && pickableWorkouts.length > 0;
```

(`isRestDay` is already `false` as a local const in this file; the condition still reads correctly and will pick up real rest-day logic if that constant is wired up later.)

- [ ] **Step 3: Render the affordance and modal**

Inside `styles.bottomArea`'s `Animated.View` (right after the `<ActionButton ... />` closing tag, still inside that `Animated.View`), add:

```tsx
{canChangeDay && (
  <TouchableOpacity
    onPress={openPicker}
    hitSlop={8}
    style={{ alignSelf: "center", marginTop: 10 }}
  >
    <Text
      style={{
        color: Palette.accent,
        fontSize: 11,
        fontFamily: FontFamilies.medium,
        letterSpacing: 1.2,
        textTransform: "uppercase",
      }}
    >
      Change Day
    </Text>
  </TouchableOpacity>
)}
```

Add `TouchableOpacity` and `Text` to the existing `react-native` import (line 17) if not already present, and import `FontFamilies` alongside `Palette` from `@/constants/theme` (line 7).

Then, just before the closing `</View>` of the outer `styles.container` (after the `Animated.View` bottom area, still inside `<View style={styles.container}>`), add:

```tsx
<WorkoutPickerModal
  visible={pickerVisible}
  workouts={pickableWorkouts}
  onPick={pickWorkout}
  onClose={closePicker}
/>
```

- [ ] **Step 4: Verify with typecheck and lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: no errors.

- [ ] **Step 5: Manual verification**

Run: `npm start`, open the app:
- With an active plan that has ≥2 workouts scheduled and no active/finished session today: confirm "Change Day" appears under the Start button, tapping it opens a sheet listing every workout in the plan with correct day chips.
- Tap a non-today workout: confirm it navigates into the session screen with that workout's exercises loaded (not today's).
- Start an active session, return to Home: confirm "Change Day" is hidden (button shows "Resume Workout").
- Finish a workout for today, return to Home: confirm "Change Day" is hidden (button shows "Workout Finished").
- With no active plan: confirm "Change Day" is hidden.

- [ ] **Step 6: Commit**

```bash
git add src/features/home/screens/HomeScreen.tsx
git commit -m "Wired a change-day affordance into Home to start any of the plan's workouts"
```
