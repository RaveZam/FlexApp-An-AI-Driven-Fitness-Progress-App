# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start              # Start Expo dev server
npm run android        # Run on Android
npm run ios            # Run on iOS
npm run web            # Run in browser
npm run lint           # Run ESLint
```

No test suite is configured.

## Architecture

**FlexApp** is a React Native fitness tracking app built with Expo. Uses file-based routing via Expo Router and Supabase as the backend.

### Feature-Based Structure

```
app/                          # Expo Router (thin re-export wrappers only)
src/features/
  auth/                       # Authentication (login, register, session)
    hooks/useAuth.tsx
    screens/
  home/                       # Home dashboard (charts, insights, PRs)
    components/
    screens/
  workouts/                   # Core workout feature, split by sub-domain
    plan/                     # Workout plans (PlanCard at root)
      screens/                # WorkoutsScreen (plan list), PlanDetailScreen, CreatePlanScreen
      hooks/                  # usePlans, useCreatePlan, useTodaysWorkouts
    workout/                  # Single workouts
      screens/                # WorkoutDetailScreen, CreateWorkoutScreen, WorkoutTemplatesScreen
      hooks/                  # useWorkouts, useCreateWorkout(+Form), useEditWorkoutExercises, useUpdateWorkoutDays
      components/             # DayPicker, ExerciseEditorRow, ExercisePickerModal, DayChipsEditor, ExerciseRow, WorkoutDetailHeader
    session/                  # Active workout session (sessionView types at root)
      screens/                # WorkoutSessionScreen
      hooks/                  # useWorkoutSession(+Screen), useStartSession, useRestTimer, useSessionGuard, useExerciseHistory
      components/             # SetRow, RestTimerModal, WorkoutLogModal, ExercisesListSheet, Session*
      core/                   # Pure session logic (no React)
      services/               # sessionLocalService, liveActivity, restNotifications
    context/ActivePlanContext.tsx  # Shared across sub-domains
    services/                 # Shared SQLite (*LocalService) + Supabase (*SupabaseService) reads/writes
    types/                    # Shared domain types
  outbox/                     # Offline-first write queue + Supabase sync (cross-feature)
    services/outbox.ts        # enqueueOutbox()
    services/sync.ts          # runOutboxSync() — drains pending rows, dispatches to Supabase
    index.ts                  # barrel — import via `@/src/features/outbox`
  overview/                   # Progress/stats screen
    screens/
  settings/                   # User settings
    screens/
src/lib/
  supabase.ts                # Supabase client
components/                   # Shared UI (ThemedText, ThemedView, ui/)
constants/                    # Shared constants (Colors, theme)
hooks/                        # App-level hooks (useColorScheme, useThemeColor, useStorageCleaner)
```

### Key Pattern: Thin Route Files

All `app/` route files are single-line re-exports:
```tsx
export { default } from "@/src/features/workouts/screens/WorkoutsIndexScreen";
```
All logic and UI lives in `src/features/`. The `app/` directory defines routing only.

### Navigation Structure

Expo Router with two top-level route groups:
- `(auth)/` — Login and register (unauthenticated)
- `(tabs)/` — Main app with custom bottom tab bar (Home, Workouts, Overview, Settings)

The root `app/_layout.tsx` wraps the app in: `AuthProvider` → `WorkoutContextProvider` → `ThemeProvider`.

Workouts has a nested Stack: `index → PlanDetails → CreatePlanScreen → WorkoutSelector → Summary → WorkoutScreen`

### State Management

1. **`src/features/auth/hooks/useAuth.tsx`** — Supabase session, `signIn()`, `signUp()`, `signOut()`.
2. **`src/features/workouts/context/workoutContext.tsx`** — Plan creation flow + active workout session state. Consumed via `useWorkoutContext()` hook.

### Data Fetching & Writes

- **Reads**: hooks in `src/features/workouts/hooks/` call services in `services/` (SQLite for local-first data, Supabase for catalog/remote).
- **Writes**: mutations write to SQLite immediately, then `enqueueOutbox(...)` queues a row for `runOutboxSync()` to push to Supabase. The outbox lives in its own feature (`src/features/outbox`) so other features can use it.

### Key Technologies

| Concern | Library |
|---|---|
| Styling | NativeWind v4 (Tailwind classes) |
| Charts | Victory Native |
| Animations | React Native Reanimated |
| Backend/Auth | Supabase |
| Icons | Expo Vector Icons + Expo Symbols |
| Storage | AsyncStorage + Expo SQLite |

### Environment Variables

```
EXPO_PUBLIC_SUPABASE_URL=...
EXPO_PUBLIC_SUPABASE_ANON_KEY=...
```

### TypeScript

Strict mode enabled. Path alias `@/*` resolves to project root. Feature code is referenced as `@/src/features/...`.

Engineering principles (module design, boundaries, code style) live in @AGENTS.md.
