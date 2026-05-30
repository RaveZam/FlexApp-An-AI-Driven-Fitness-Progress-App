# Download Sync — Design

**Date:** 2026-05-30
**Status:** Approved

## Goal

Pull all of a user's remote data from Supabase (scoped by `userId`) and merge it
into local SQLite, so a fresh install or a new device restores their data. This
is the mirror image of the existing outbox upload path (`runOutboxSync`), reading
in the download direction.

## Scope

User-owned tables:

| Table | Has `updated_at`? | Strategy |
|---|---|---|
| `user_workout_plans` | yes | newest-wins upsert |
| `user_workouts` | yes | newest-wins upsert |
| `user_preferences` | yes | newest-wins upsert |
| `workout_sessions` | yes | newest-wins upsert |
| `user_workout_exercises` | no (created_at) | replace-with-parent (workout) |
| `user_workout_days` | no (created_at) | replace-with-parent (workout) |
| `session_exercises` | no | replace-with-parent (session) |
| `session_sets` | no | replace-with-parent (session) |

## File

One new file: `src/features/outbox/services/download.ts`, exporting
`runDownloadSync(userId: string): Promise<void>`. Lives beside `sync.ts` in the
outbox feature — same cross-cutting concern (offline sync), read direction.

## Flow

1. **Network gate:** return early if `!isWifiConnected()`, matching `runOutboxSync`.

2. **Fetch parents** in parallel, filtered by `user_id`:
   `user_workout_plans`, `user_workouts`, `user_preferences`, `workout_sessions`.

3. **Newest-wins per parent row:** read the local row's `updated_at`
   (existing getter where available, e.g. `workouts.getUpdatedAt`; otherwise a
   small `SELECT updated_at`). Apply the remote row only if the local row is
   missing or `remote.updated_at > local.updated_at`. Un-synced local edits are
   preserved.

4. **Apply parents via existing DAOs:** `plans.upsert`, `workouts.upsert`,
   `preferences.upsertFromRemote`, `sessions.insert`/upsert. Reuse existing DAO
   methods; add a getter only if one is genuinely missing.

5. **Replace children with applied parent:** for each parent that was applied,
   fetch its remote children, delete local children, re-insert wholesale:
   - workout applied → `days.replace(workoutId, ...)` and delete+insert
     `user_workout_exercises` for that workout.
   - session applied → `deleteBySession` for `session_exercises` /
     `session_sets`, then re-insert remote children.

   Children always match their parent (the chosen cascade strategy).

## Trigger

Runs **on login / app start once a session exists**. The seam already exists in
`src/features/auth/hooks/useAuth.tsx`: the `onAuthStateChange` handler runs
`syncPreferencesFromRemote(userId)` once per user via `syncedUserIdsRef`. Replace
that preference-only call with `runDownloadSync(userId)`, which subsumes
preferences. Guard remains once-per-user-per-session.

## Error handling

Same posture as `runOutboxSync`: wrap each entity/section in try/catch,
`console.error(...)` and continue. One bad row never aborts the whole pull.
The caller in `useAuth` already `.catch(...)`es.

## Out of scope (YAGNI)

- No deletion of local rows missing remotely (download is additive + newest-wins).
- No UI / progress indicator.
- No manual "restore" button.
- No new DAO abstraction layer beyond a missing getter, if any.
