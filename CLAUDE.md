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
  workouts/                   # Core workout feature (plans, sessions, tracking)
    components/
      create/                 # Create-workout form pieces (DayPicker, ExerciseEditorRow, ExercisePickerModal)
      session/                # Active session UI (SetRow, RestTimerModal, WorkoutLogModal, ExercisesListSheet)
    context/workoutContext.tsx
    hooks/                    # All workout hooks (flattened)
    screens/                  # Layout-only screens; logic lives in hooks
    services/                 # SQLite (*LocalService) + Supabase (*SupabaseService) reads/writes
    types/
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

@AGENTS.md

## Architecture Principles

- No abstraction layers that don't reduce real duplication.
- No design patterns by name (no "factory", "strategy", "observer") unless obvious.
- No TypeScript generics gymnastics. If the type is complex, simplify the data.
- Prefer co-location: keep logic near where it's used, not in a shared folder.
- Don't extract a hook unless it's reused in 2+ places.
- Avoid HOCs. Prefer composition via props.
- RPC over client-side data transforms — push SQL logic to Supabase functions.
- SQLite queries stay in the data layer, never inline in components.

## When adding new code

- Show me the simplest version first, then ask if I want more.
- Flag if you're about to create a new file/folder and why.
- Prefer editing existing files over creating new ones.

## Code Style Rules

- Prefer flat over nested. Max 2 levels of nesting.
- Functions do ONE thing. If you need to explain it with "and", split it.
- No abstractions until you need them 3 times (rule of three).
- Name variables for what they ARE, not what they do. `userId` not `getUserId`.
- No barrel exports, no index.ts re-exports unless asked.
- Inline comments only for WHY, never for WHAT.
- Prefer explicit over clever. No one-liners that need decoding.
- Default to flat file structure. Don't create folders for <3 files.
- No utility files/helpers until there's actual duplication.

## Supabase / Data

- Always use RPCs for aggregations or multi-table reads. No chained client-side queries.
- Never expose Supabase client outside the data layer.
- RLS is the auth boundary — don't duplicate it in application logic.
  
## What NOT to do

- Don't scaffold folders speculatively ("we might need this later").
- Don't add loading/error states I didn't ask for yet.
- Don't refactor working code while fixing something else.