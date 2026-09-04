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
    plan/                     # Workout plans
      screens/                # WorkoutsScreen (plan list), PlanDetailScreen, CreatePlanScreen
      hooks/                  # usePlans, useCreatePlan, useTodaysWorkouts, use*Screen
      components/             # PlanCard, PlanWorkoutCard, PlanDetailMasthead/Nav, WorkoutsMasthead, WorkoutDayChips, CreatePlanButton
      core/                   # Pure plan logic (planTotals)
    workout/                  # Single workouts
      screens/                # WorkoutDetailScreen, CreateWorkoutScreen, WorkoutTemplatesScreen
      hooks/                  # useWorkouts, useCreateWorkout, useEditWorkoutExercises, useUpdateWorkoutDays, use*Screen
      components/             # DayPicker, ExerciseEditorRow/Row/MuscleGroup, ExercisePickerModal, DayChipsEditor, WorkoutDetailHeader/Masthead, WorkoutEditActions, WorkoutDaysField, CreateWorkoutExercises, Template*
      core/                   # Pure workout logic (exerciseGroups, templateSplits)
    session/                  # Active workout session (sessionView types at root)
      screens/                # WorkoutSessionScreen
      hooks/                  # useWorkoutSession(+Screen), useStartSession, useRestTimer, useSessionGuard, useExerciseHistory
      components/             # SetRow, RestTimerModal, WorkoutLogModal, ExercisesListSheet, Session*
      core/                   # Pure session logic (no React)
      services/               # sessionLocalService, liveActivity, restNotifications
    context/ActivePlanContext.tsx  # Shared across sub-domains
    components/               # Shared across sub-domains (EmptyState, CreateHeader, NameField)
    services/                 # SQLite-only (*LocalService): reads + writes (DAO write + enqueueOutbox together)
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

### Key Pattern: Screens Are Composition Only

A screen imports one `use<Screen>Screen()` hook and renders components. It holds no
route-param reads, no lookups, no `useRouter()` calls, and no second component
declaration — those live in `hooks/` and `components/` respectively. See AGENTS.md
("Screens hold no logic", "Components").

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

- **Reads**: hooks call services in `services/`, which read SQLite only. There is exactly one path that pulls from Supabase into SQLite — `runDownloadSync()` (`src/features/outbox/services/download.ts`), triggered on login (`authGate`) and app foreground (`useSyncScheduler`). A feature hook or component never calls `supabase.from(...)` for a read; if data needs to be fresher, that means teaching `runDownloadSync` about it, not adding a second fetch.
- **Writes**: mutations write to SQLite and call `enqueueOutbox(...)` together, inside one `services/` function wrapped in `db.withTransactionSync(...)`. The outbox lives in its own feature (`src/features/outbox`) so other features can use it. The enqueued `payload` must carry every field `runOutboxSync()`'s dispatcher needs to push to Supabase — the dispatcher must not re-query SQLite to fill in what the payload left out.

### Key Technologies

| Concern | Library |
|---|---|
| Styling | NativeWind v4 (Tailwind classes) |
| Charts | Victory Native |
| Animations | React Native Reanimated |
| Backend/Auth | Supabase |
| Icons | Expo Vector Icons + Expo Symbols |
| Storage | AsyncStorage + Expo SQLite |

### Visual Language

`src/theme/palettes.ts` is the only source of color. Both schemes are always filled in.

The accent is a **load ladder** — `accentPine → accentForest → accent → accentBright →
accentLime`, one green hue family climbing in brightness. Brightness encodes *load and
recency*, never decoration. The top two rungs have to be earned by the data (a personal
best, the latest session, the heaviest fifth of the log); nothing reaches past `accent`
just to look brighter. `loadLadder(p)` returns the ladder in order so charts index into
it, and `loadRung(value, peak)` maps a figure onto it.

Type is two families from `constants/theme.ts`: **Outfit** (`display*`) for figures,
month names, and headline moments — its light weights at large sizes are the app's quiet
register; **Inter** for names, body, and the uppercase letter-spaced eyebrows and labels.
Numbers that stack in a column get `fontVariant: ["tabular-nums"]`.

**`src/features/history/` is the reference implementation** of where the app is heading —
a ledger, not a dashboard. New surfaces should look like it:

- **No cards.** No `inkRaised` panels, no borders, no radii. The page is type, hairline
  rules, and data marks on flat `ink`. Structure comes from alignment, not containers.
- **The spine.** One hairline runs the length of the list in a fixed left gutter
  (`components/spine.ts`). Entries hang off it as nodes whose size *and* ladder rung are
  their volume; months cut the line with a notch instead of getting a header band.
- **The list is the chart.** Reading the log top to bottom is reading the data — the
  heavy days are visibly bigger and brighter. No separate chart restating the rows.
- **Structure encodes information.** A month marker carries that month's own session
  count and volume. A node carries load *and* status (hollow = open or cancelled).
  Nothing is present only to divide or decorate.
- **One orchestrated motion moment per screen** — the skyline drawing itself on load.
  Everything else fades in. No per-row entrance staggers.

### Environment Variables

```
EXPO_PUBLIC_SUPABASE_URL=...
EXPO_PUBLIC_SUPABASE_ANON_KEY=...
```

### TypeScript

Strict mode enabled. Path alias `@/*` resolves to project root. Feature code is referenced as `@/src/features/...`.

Engineering principles (module design, boundaries, code style) live in @AGENTS.md.
