# AGENTS.md

Engineering principles for FlexApp. Imported by CLAUDE.md. These govern *how* code is written;
CLAUDE.md describes *what* the project is.

## Module design (Ousterhout, "deep modules")

- Prefer deep modules: narrow interface, lots hidden. Flag shallow ones.
- Hooks: only React concerns (state/effects/context) live in the hook.
  Pure logic goes in plain functions under `core/` that don't import react.
- Red flag: a hook returning N loose functions the caller must call in order.
  That ordering is implementation detail — hide it behind one method.
- Don't add interface (files, methods, params) without hiding complexity.

## Screens hold no logic

A screen file is imports + JSX. Every piece of React glue it would otherwise
hold — route params, lookups against a list, derived flags, navigation
callbacks — goes into a `use<Screen>Screen()` hook next to it.

- **Extract the hook even at a single call site.** One consumer is the normal
  case for a screen hook; that's not a reason to leave the glue inline. The
  win is that the screen reads as layout and the logic is testable on its own.
- The hook returns a flat object of what the screen renders and the callbacks
  it fires (`{ plan, isActive, toggleActive, openWorkout }`).
- `useRouter()` belongs in the hook, not the screen — a screen should not build
  route objects inline.
- This overrides the general "don't extract until reused" instinct below:
  that rule is about inventing *shared abstractions*, not about moving code
  into the layer it belongs in.

## Architecture Principles

- No abstraction layers that don't reduce real duplication.
- No design patterns by name (no "factory", "strategy", "observer") unless obvious.
- No TypeScript generics gymnastics. If the type is complex, simplify the data.
- Prefer co-location: keep logic near where it's used, not in a shared folder.
- Avoid HOCs. Prefer composition via props.
- RPC over client-side data transforms — push SQL logic to Supabase functions.
- SQLite queries stay in the data layer, never inline in components.

## Layering (dependency direction)

Dependencies point downward only. Keep the import graph acyclic.

```
components/ · constants/ · hooks/ · src/lib/   (shared bottom — depends on nothing app-specific)
        ↑
src/features/<feature>/                          (depends on shared + its own internals)
        ↑
app/                                             (routing only — thin re-exports)


Touches supabase/sqlite → services/.
Pure JS, no React (loops, math, transforms, validation) → core/.
Only what's left — useState, useEffect, memo, refs, cleanup — stays in the hook.
```

- Shared `components/`, `constants/`, root `hooks/`, and `src/lib/` must NOT import from `src/features/`.
- A feature may import shared layers and its own files freely.
- Cross-feature use goes through the feature's public entry point only (see Imports), never a deep internal path.
- No circular imports between features. If two features need the same thing, it belongs in a shared layer or its own feature (like `outbox`).

## Components

- **One component per file. Never two.** If a file declares a second component —
  even a five-line chip or row used once right below it — that component gets its
  own file in the feature's `components/`. This is not negotiable on size.
- Name the file after what it renders (`PlanWorkoutCard.tsx`, `PlanEmptyState.tsx`),
  not after where it sits in the tree.
- A component owns its own `makeStyles(p)`. Don't share one style sheet across files.
- `components/` is flat. Only nest a per-screen subfolder if one screen produces so
  many pieces that the flat list stops being scannable.

## UI implementation

The design language itself (the load ladder, the spine, no cards) is in CLAUDE.md.
These are the mechanics for building to it.

- Color comes from `usePalette()`. No raw hex in a feature file — if a color is missing,
  add the token to **both** schemes in `src/theme/palettes.ts`.
- Every component owns its own sheet and memoizes it:
  `const makeStyles = (p: Palette) => StyleSheet.create({...})`, then
  `const styles = useMemo(() => makeStyles(p), [p])`.
- **Never pass a function to a `Pressable`'s `style`** — NativeWind v4 drops the function
  form, so `({ pressed }) => ...` silently does nothing. Press feedback is a Reanimated
  shared value driving opacity on an `Animated.createAnimatedComponent(Pressable)`;
  `components/ui/ActionButton.tsx` is the pattern.
- Prefer opacity cross-fades for state changes. Reach for movement only when the motion
  is the information (a bar growing to its value).
- Gate every animation on `useReducedMotion()`. The reduced path sets the end value
  directly — it never skips the state change.
- Drive animations from `useEffect`, not from a shared-value write during render.
- Interactive elements carry `accessibilityRole` and a label naming the thing, not the
  control: `Actions for Push A`, not `More`.
- A layout constant two or more components must agree on (a gutter x, a chart height)
  lives in one small module beside them and gets imported. A spine drawn at two different
  x values is a broken line, not a style difference — this is the exception to "no
  utility files".

## Passing data down

Props are the default. A parent that owns the data hands it to its children.

- **Prop drilling a level or two is fine**, and it's the right call when the value
  comes from spread-out state — a context, a focus-refetching hook, a list item's
  own slice. Passing it down once beats every child re-deriving it.
- Don't make each component call the feature hook itself just to avoid a prop.
  With a hook like `usePlans` that refetches on focus, a second caller means a
  second fetch — that's a behavior change wearing a refactor's clothes.
- Pull data in a child only when it genuinely owns that concern (a modal fetching
  its own detail record), not to shorten a prop list.

## Boundaries & DTOs

- Don't pass raw Supabase/SQLite rows into screens or components. Map DB rows to domain
  types in the `services/` layer; components depend on the domain type, not the DB shape.
- Define domain types in the feature's `types/`. The DB schema is an implementation detail
  of the data layer — it must not leak past it.
- This is the same idea as "never expose the Supabase client outside the data layer,"
  applied to the *data shapes* the client returns.

## DAO null-tolerance

The contract: a DAO function accepts every argument as possibly-null and absorbs
the null itself — so the caller passes data straight through without guarding.
Null at the start → don't run anything. The reader never writes `if (!x) return`
before a DAO call; the DAO already did.

- Args that can be null are typed `T | null` (e.g. `userId: string | null`).
- Guard at the top, before any DB work: if a required arg is null, bail out
  immediately. `if (!userId) return null;` — the query never runs.
- Reads return `null` (single) or `[]` (list) when bailing — never throw.
  `getActiveSessionForUser(userId: string | null)` returns `null` on a null userId.
- Writes (insert/update/delete) no-op when bailing — return without touching the
  DB, don't throw. The mutation simply doesn't happen.
- This keeps null-handling in one place (the DAO) instead of scattered across
  every call site. Call sites read clean: `getActiveSessionForUser(userId)`,
  not `userId ? getActiveSessionForUser(userId) : null`.

## Imports

- Avoid barrel/`index.ts` re-export files in general — they hurt tree-shaking and invite cycles.
- The one allowed barrel: a feature's single public entry point (e.g. `src/features/outbox/index.ts`).
  Import another feature ONLY through that entry, never via its internal paths.
- Within a feature, import directly from the source file.

## Error handling

- Throw descriptive errors with context (the id, the operation, what failed) — not generic
  strings. Good: `Failed to sync set ${setId}: outbox row missing exerciseId`. Bad: `"Sync failed"`.
- Sync/outbox and SQLite failures must carry enough context to debug offline issues after the fact.

## When adding new code

- Show me the simplest version first, then ask if I want more.
- Flag if you're about to create a new file/folder and why.
- Prefer editing existing files over creating new ones.

## Code Style Rules

- Prefer flat over nested. Max 2 levels of nesting.
- Functions do ONE thing. If you need to explain it with "and", split it.
- No abstractions until you need them 3 times (rule of three). This governs new
  shared *abstractions* — it never justifies leaving code in the wrong layer.
  Pure logic goes to `core/` and screen glue goes to a hook on the first use.
- Name variables for what they ARE, not what they do. `userId` not `getUserId`.
- No barrel exports, no index.ts re-exports unless asked (exception: feature public entry, see Imports).
- Inline comments only for WHY, never for WHAT.
- Prefer explicit over clever. No one-liners that need decoding.
- Default to flat file structure. Don't create folders for <3 files — except the
  layer folders (`core/`, `services/`, `hooks/`, `components/`, `screens/`), which
  exist from their first file so the layering stays readable.
- No utility files/helpers until there's actual duplication.

## Supabase / Data

- Always use RPCs for aggregations or multi-table reads. No chained client-side queries.
- Never expose Supabase client outside the data layer.
- RLS is the auth boundary — don't duplicate it in application logic.
- **One remote-read path only.** `runDownloadSync` (`src/features/outbox`) is the sole place that pulls from
  Supabase into SQLite. Feature hooks/services read SQLite only — never `supabase.from(...).select(...)` from
  a hook or component. Two independent pull paths race and the loser can clobber a local edit that hasn't
  synced yet; this happened once with `usePlans`/`useWorkouts` fetching Supabase on every screen focus.
  If a screen needs fresher data, teach `runDownloadSync` about it, don't add a second fetch.
- A local cache table that `runDownloadSync` populates needs a matching DAO **read** function. A write-only
  cache (upsert with no list/get) is dead weight — something is still calling Supabase directly instead of
  reading it, which is the bug above in disguise.
- **Outbox payload carries the full snapshot.** `enqueueOutbox`'s `payload` must contain everything
  `runOutboxSync()`'s dispatcher needs to write to Supabase. The dispatcher must not re-query SQLite to
  fill in gaps — that split write path is a second source of truth and drifts silently.
- Every write service does the DAO write and `enqueueOutbox` together inside one `db.withTransactionSync(...)`.
  Never call them as two separate statements — a crash between them silently drops the sync.

## What NOT to do

- Don't scaffold folders speculatively ("we might need this later").
- Don't add loading/error states I didn't ask for yet.
- Don't refactor working code while fixing something else.
