# Rest Timer Default — Design

**Date:** 2026-05-20
**Status:** Approved design, pending implementation plan

## Goal

Let a user configure a single global default rest time (in seconds) that's used by the in-session rest timer. Persist locally for offline use and sync to Supabase so it follows the user across devices.

## Scope

- One scalar preference: `rest_timer_seconds` (integer).
- Default value: **120 seconds (2 minutes)** on first launch.
- Editable from the Settings screen.
- Adjustable inline in `RestTimerModal` during a session, with an explicit "Save as default" action.
- Synced across devices via Supabase, using the existing local-first + outbox pattern.
- Sync-down on login: Supabase row wins if it exists; otherwise local default is pushed up.

Out of scope: per-exercise overrides, per-set-type rest, per-plan rest, multiple preferences (this design picks a table layout that accommodates more preferences later without migration).

## Schema

### SQLite (`user_preferences`)

```sql
CREATE TABLE IF NOT EXISTS user_preferences (
  user_id TEXT PRIMARY KEY,
  rest_timer_seconds INTEGER NOT NULL DEFAULT 120,
  updated_at TEXT NOT NULL
);
```

Single row per user. Added to `src/features/workouts/services/db.ts` (or the relevant init module) alongside the other table definitions.

### Supabase (`user_preferences`)

| Column                | Type        | Notes                                            |
|-----------------------|-------------|--------------------------------------------------|
| `user_id`             | `uuid`      | PK, FK → `auth.users(id)` ON DELETE CASCADE     |
| `rest_timer_seconds`  | `int4`      | NOT NULL, DEFAULT 120, CHECK (15 ≤ x ≤ 600)     |
| `updated_at`          | `timestamptz` | NOT NULL, DEFAULT `now()`                      |

**RLS:** enable, with policies for `select`, `insert`, `update` where `auth.uid() = user_id`.

## Architecture

### Files added

```
src/features/settings/
  services/
    userPreferencesLocalService.ts        # SQLite reads/writes
    userPreferencesSupabaseService.ts     # Supabase upsert + fetch
  hooks/
    useRestTimerDefault.ts                # exposes { restSeconds, setRestSeconds }
    useSyncUserPreferencesOnLogin.ts      # one-shot sync-down on auth
```

### Files modified

- `src/features/settings/screens/SettingsScreen.tsx` — add "Default rest time" row.
- `src/features/workouts/components/session/RestTimerModal.tsx` — add inline +/- adjust + "Save as default" action.
- `src/features/outbox/services/sync.ts` — register `user_preferences` dispatch to `userPreferencesSupabaseService.upsertPreferences`.
- `src/features/workouts/services/db.ts` (or equivalent SQLite init) — add `user_preferences` table.
- `src/features/auth/hooks/useAuth.tsx` — call `useSyncUserPreferencesOnLogin` (or trigger sync-down after `signIn` resolves).

## Data flow

### Read (workout session or settings screen)
1. `useRestTimerDefault` queries SQLite via `userPreferencesLocalService.getPreferences(userId)`.
2. If no row exists, seed with 120s and enqueue an outbox upsert.
3. Return `restSeconds` to caller.

### Write (Settings change or "Save as default")
1. Update SQLite immediately via `setRestTimerSeconds(userId, seconds)`.
2. Update hook state so consumers re-render.
3. `enqueueOutbox({ table: 'user_preferences', op: 'upsert', payload: { user_id, rest_timer_seconds, updated_at } })`.
4. `runOutboxSync()` drains the row and calls `userPreferencesSupabaseService.upsertPreferences(payload)`.

### Sync-down on login
1. After `signIn` resolves, fetch the user's `user_preferences` row from Supabase.
2. If a row exists: overwrite local SQLite with the server values (server wins).
3. If no row exists: insert local default (120s) into SQLite and enqueue an upsert so Supabase gets seeded.
4. This runs once per login, not on every app open.

## UI

### SettingsScreen
- New row labeled "Default rest time".
- Stepper or numeric input, 15s increments, range **15–600s**, displayed as `mm:ss`.
- Writes go through `useRestTimerDefault.setRestSeconds`.

### RestTimerModal
- Existing timer display unchanged.
- Add `+15s` / `-15s` buttons that adjust the **current** rest only.
- Add a small "Save as default" button that calls `setRestSeconds(current)` — only this action persists the change.
- Mid-session adjustments do not auto-save, so an unusual rest doesn't leak into the default.

## Validation

- Clamp to 15–600s on both UI and service layer; reject anything else.
- Supabase CHECK constraint enforces the same range as a defense-in-depth.

## Error handling

- SQLite write failure: surface a toast/log and don't update hook state.
- Supabase upsert failure: row stays in outbox and retries per existing `runOutboxSync` behavior. No special UI.
- Sync-down failure on login: log and fall back to local value; do not block login.

## Testing

No test suite is configured in this repo (per CLAUDE.md), so verification is manual:

- Fresh install: open Settings → default reads 120s.
- Change to 90s in Settings → reflected in RestTimerModal on next set.
- In RestTimerModal: +15s then "Save as default" → Settings shows updated value.
- Kill app, reopen → value persists (SQLite).
- Log out, log in on a second device with a different default → second device adopts the synced value (sync-down).
- Airplane mode: change value → outbox holds row → restore network → Supabase row updates.

## Open questions

None — all resolved during brainstorming.
