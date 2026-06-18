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

## Architecture Principles

- No abstraction layers that don't reduce real duplication.
- No design patterns by name (no "factory", "strategy", "observer") unless obvious.
- No TypeScript generics gymnastics. If the type is complex, simplify the data.
- Prefer co-location: keep logic near where it's used, not in a shared folder.
- Don't extract a hook unless it's reused in 2+ places.
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
- No abstractions until you need them 3 times (rule of three).
- Name variables for what they ARE, not what they do. `userId` not `getUserId`.
- No barrel exports, no index.ts re-exports unless asked (exception: feature public entry, see Imports).
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
