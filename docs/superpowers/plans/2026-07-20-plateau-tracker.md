# Plateau Tracker Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Detect exercises whose top set hasn't improved in 3 consecutive sessions, surface them on the Home screen, and attach a short AI-generated coaching tip fetched from a Supabase Edge Function backed by Gemini.

**Architecture:** A pure detection function reduces the same per-session "top set" data the existing Progressive Overload feature already computes. A new local-only SQLite table caches AI tips keyed on the exercise's current stuck weight/reps, so a new PR naturally invalidates the cache. A new Supabase Edge Function proxies to Gemini so the API key never touches the client. All wiring follows the existing `home` feature's hook/service/component layering.

**Tech Stack:** React Native (Expo), TypeScript, expo-sqlite, Supabase (`@supabase/supabase-js`, Edge Functions on Deno), Gemini API (`gemini-2.0-flash`).

## Global Constraints

- Screens stay UI-only; business/data logic lives in hooks/services/core (per project convention).
- No test suite is configured in this repo — verification is manual (temporary `npx tsx` scripts for pure functions, running the app for integration).
- Never commit the Gemini API key. It is set as a Supabase secret (`GEMINI_API_KEY`), read only inside the Edge Function via `Deno.env.get`.
- Follow existing styling conventions: `Palette`/`FontFamilies` from `@/constants/theme`, `react-native-reanimated` `FadeInDown` entrances, matching the visual language of `InsightCard`/`ExerciseCard`.

---

### Task 1: Extract the session→exercise pivot into a shared core function

**Files:**
- Create: `src/features/home/core/toExerciseProgress.ts`
- Modify: `src/features/home/hooks/ProgressiveOverload/useProgressiveOverload.ts`

**Interfaces:**
- Produces: `toExerciseProgress(workouts: LoggedWorkout[]): ExerciseProgress[]` — exported, pure, no React/DB imports. `LoggedWorkout`/`ExerciseProgress` types come from `src/features/home/types/progressiveOverload.ts` (existing).

- [ ] **Step 1: Create the core file with the extracted logic**

Move `normalizeGroup` and `toExerciseProgress` out of `useProgressiveOverload.ts` verbatim:

```ts
// src/features/home/core/toExerciseProgress.ts
import type {
  ExerciseProgress,
  LoggedWorkout,
} from "@/src/features/home/types/progressiveOverload";

// Catalog muscle_group values aren't consistently cased/trimmed, so collapse
// them to one canonical form for grouping, chips, and filtering.
function normalizeGroup(group: string | null): string | null {
  const trimmed = group?.trim().toLowerCase();
  return trimmed ? trimmed : null;
}

// Pivot sessions (newest first) into one series per exercise, keeping each
// session's heaviest completed set as the data point for the chart.
export function toExerciseProgress(workouts: LoggedWorkout[]): ExerciseProgress[] {
  const byName = new Map<string, ExerciseProgress>();

  for (const workout of workouts) {
    for (const exercise of workout.exercises) {
      let topWeight = 0;
      let topReps = 0;
      for (const set of exercise.sets) {
        if (!set.completed) continue;
        const weight = set.weight ?? 0;
        // Unilateral sets log per-side reps; total work is both sides combined.
        const reps = exercise.isUnilateral
          ? (set.actualRepsLeft ?? 0) + (set.actualRepsRight ?? 0)
          : set.actualReps ?? 0;
        if (weight > topWeight || (weight === topWeight && reps > topReps)) {
          topWeight = weight;
          topReps = reps;
        }
      }

      const entry =
        byName.get(exercise.name) ??
        { name: exercise.name, muscleGroup: normalizeGroup(exercise.muscleGroup), points: [] };
      entry.points.push({
        sessionId: workout.id,
        completedAt: workout.completedAt,
        weight: topWeight,
        reps: topReps,
      });
      byName.set(exercise.name, entry);
    }
  }

  // Sessions arrive newest first; reverse each series to chronological order.
  return [...byName.values()].map((e) => ({ ...e, points: e.points.reverse() }));
}
```

- [ ] **Step 2: Update `useProgressiveOverload.ts` to import instead of defining it**

Replace the local `normalizeGroup`/`toExerciseProgress` definitions in `src/features/home/hooks/ProgressiveOverload/useProgressiveOverload.ts` with an import, so the file becomes:

```ts
import { useAuth } from "@/src/features/auth";
import { toExerciseProgress } from "@/src/features/home/core/toExerciseProgress";
import { listLoggedWorkouts } from "@/src/features/home/services/ProgressiveOverloadDao/progressiveOverloadDao";
import type { ExerciseProgress } from "@/src/features/home/types/progressiveOverload";
import { useMemo } from "react";

export const ALL_BODY_PARTS = "All";

export function useProgressiveOverload(bodyFilter: string = ALL_BODY_PARTS) {
  const { user } = useAuth();

  const all = useMemo<ExerciseProgress[]>(() => {
    if (!user) return [];
    return toExerciseProgress(listLoggedWorkouts(user.id));
  }, [user]);

  const muscleGroups = useMemo(() => {
    const groups = new Set<string>();
    for (const e of all) if (e.muscleGroup) groups.add(e.muscleGroup);
    return [...groups].sort();
  }, [all]);

  // No explicit filter yet? Fall back to the first available group so the
  // initial render isn't empty.
  const selectedGroup = bodyFilter || muscleGroups[0] || ALL_BODY_PARTS;

  const exercises = useMemo(() => {
    if (selectedGroup === ALL_BODY_PARTS) return all;
    return all.filter((e) => e.muscleGroup === selectedGroup);
  }, [all, selectedGroup]);

  return { exercises, muscleGroups, selectedGroup };
}
```

- [ ] **Step 3: Verify the Progressive Overload chart is unaffected**

Run: `npm start` and open Home in Expo Go/simulator.
Expected: The "Your Progress" chart renders exactly as before (same exercises, same bars, same chip filters). No console errors about missing `toExerciseProgress`/`normalizeGroup`.

- [ ] **Step 4: Commit**

```bash
git add src/features/home/core/toExerciseProgress.ts src/features/home/hooks/ProgressiveOverload/useProgressiveOverload.ts
git commit -m "Extracted the session-to-exercise pivot into a shared core function"
```

---

### Task 2: Write the plateau detection core function

**Files:**
- Create: `src/features/home/core/detectPlateaus.ts`

**Interfaces:**
- Consumes: `ExerciseProgress`/`ExercisePoint` types from `src/features/home/types/progressiveOverload.ts` (existing — `points` is chronological, oldest first).
- Produces:
  ```ts
  export type PlateauResult = {
    name: string;
    muscleGroup: string | null;
    weight: number;
    reps: number;
    sessionsStuck: number;
    lastImprovedAt: string | null;
  };
  export function detectPlateaus(exercises: ExerciseProgress[], threshold?: number): PlateauResult[];
  ```
  Task 5 (`usePlateauTracker`) imports `detectPlateaus` and `PlateauResult` by these exact names.

- [ ] **Step 1: Write the implementation**

```ts
// src/features/home/core/detectPlateaus.ts
import type { ExercisePoint, ExerciseProgress } from "@/src/features/home/types/progressiveOverload";

export type PlateauResult = {
  name: string;
  muscleGroup: string | null;
  weight: number;
  reps: number;
  sessionsStuck: number;
  lastImprovedAt: string | null;
};

const DEFAULT_THRESHOLD = 3;

function isPR(point: ExercisePoint, best: { weight: number; reps: number }): boolean {
  if (point.weight > best.weight) return true;
  if (point.weight === best.weight && point.reps > best.reps) return true;
  return false;
}

// An exercise "plateaus" when its last `threshold` sessions produced no new
// PR on its top set (heavier weight, or same weight with more reps). Needs
// at least threshold+1 sessions of history so the first session's trivial
// PR can't itself count toward the stuck streak.
export function detectPlateaus(
  exercises: ExerciseProgress[],
  threshold: number = DEFAULT_THRESHOLD,
): PlateauResult[] {
  const results: PlateauResult[] = [];

  for (const exercise of exercises) {
    const { points } = exercise;
    if (points.length < threshold + 1) continue;

    let best = { weight: 0, reps: 0 };
    let lastImprovedAt: string | null = null;
    const prFlags: boolean[] = [];

    for (const point of points) {
      const pr = isPR(point, best);
      prFlags.push(pr);
      if (pr) {
        best = { weight: point.weight, reps: point.reps };
        lastImprovedAt = point.completedAt;
      }
    }

    const lastN = prFlags.slice(-threshold);
    const plateaued = lastN.every((pr) => !pr);
    if (!plateaued) continue;

    results.push({
      name: exercise.name,
      muscleGroup: exercise.muscleGroup,
      weight: best.weight,
      reps: best.reps,
      sessionsStuck: threshold,
      lastImprovedAt,
    });
  }

  return results;
}
```

- [ ] **Step 2: Verify with a throwaway script**

Create a temporary file at the repo root (NOT committed):

```ts
// _verify.tmp.ts
import { detectPlateaus } from "./src/features/home/core/detectPlateaus";
import type { ExerciseProgress } from "./src/features/home/types/progressiveOverload";

function point(weight: number, reps: number, completedAt: string) {
  return { sessionId: completedAt, completedAt, weight, reps };
}

// Case 1: plateaued — PR on session 1, flat for the last 3.
const plateaued: ExerciseProgress = {
  name: "Bench Press",
  muscleGroup: "chest",
  points: [
    point(100, 8, "2026-01-01"),
    point(110, 8, "2026-01-08"),
    point(110, 8, "2026-01-15"),
    point(110, 6, "2026-01-22"),
    point(105, 8, "2026-01-29"),
  ],
};

// Case 2: still improving — most recent session set a new PR.
const improving: ExerciseProgress = {
  name: "Squat",
  muscleGroup: "legs",
  points: [
    point(100, 8, "2026-01-01"),
    point(105, 8, "2026-01-08"),
    point(110, 8, "2026-01-15"),
  ],
};

// Case 3: not enough history yet.
const tooNew: ExerciseProgress = {
  name: "Overhead Press",
  muscleGroup: "shoulders",
  points: [point(40, 8, "2026-01-01"), point(40, 8, "2026-01-08")],
};

const results = detectPlateaus([plateaued, improving, tooNew]);

console.assert(results.length === 1, `expected 1 plateau, got ${results.length}`);
console.assert(results[0]?.name === "Bench Press", `expected Bench Press, got ${results[0]?.name}`);
console.assert(results[0]?.weight === 110 && results[0]?.reps === 8, `expected stuck at 110x8, got ${results[0]?.weight}x${results[0]?.reps}`);
console.assert(results[0]?.lastImprovedAt === "2026-01-08", `expected lastImprovedAt 2026-01-08, got ${results[0]?.lastImprovedAt}`);

console.log("OK", JSON.stringify(results, null, 2));
```

Run: `npx tsx _verify.tmp.ts`
Expected: `OK` printed, one result for "Bench Press" with `weight: 110, reps: 8, lastImprovedAt: "2026-01-08"`, no assertion failures printed to stderr.

Then delete the scratch file:

```bash
rm _verify.tmp.ts
```

- [ ] **Step 3: Commit**

```bash
git add src/features/home/core/detectPlateaus.ts
git commit -m "Added plateau detection over the existing per-session top-set data"
```

---

### Task 3: Add the local `plateau_tips` cache table and service

**Files:**
- Modify: `src/lib/db.ts`
- Create: `src/features/home/services/plateauTipsLocalService.ts`

**Interfaces:**
- Produces:
  ```ts
  export function getCachedTip(userId: string, exerciseName: string, weight: number, reps: number): string | null;
  export function saveCachedTip(userId: string, exerciseName: string, weight: number, reps: number, tip: string): void;
  ```
  Task 5 (`usePlateauTracker`) imports both by these exact names.

- [ ] **Step 1: Add the table to the schema**

In `src/lib/db.ts`, add this `CREATE TABLE` inside the existing `execAsync` template string, right after the `outbox` table definition (before the `-- Indexes` comment):

```sql
    CREATE TABLE IF NOT EXISTS plateau_tips (
      user_id TEXT NOT NULL,
      exercise_name TEXT NOT NULL,
      weight REAL NOT NULL,
      reps INTEGER NOT NULL,
      tip TEXT NOT NULL,
      created_at TEXT NOT NULL,
      PRIMARY KEY (user_id, exercise_name, weight, reps)
    );
```

- [ ] **Step 2: Write the local service**

```ts
// src/features/home/services/plateauTipsLocalService.ts
import { getDb } from "@/src/lib/db";

export function getCachedTip(
  userId: string,
  exerciseName: string,
  weight: number,
  reps: number,
): string | null {
  const db = getDb();
  const row = db.getFirstSync<{ tip: string }>(
    `SELECT tip FROM plateau_tips WHERE user_id = ? AND exercise_name = ? AND weight = ? AND reps = ?`,
    [userId, exerciseName, weight, reps],
  );
  return row?.tip ?? null;
}

export function saveCachedTip(
  userId: string,
  exerciseName: string,
  weight: number,
  reps: number,
  tip: string,
): void {
  const db = getDb();
  db.runSync(
    `INSERT OR REPLACE INTO plateau_tips (user_id, exercise_name, weight, reps, tip, created_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [userId, exerciseName, weight, reps, tip, new Date().toISOString()],
  );
}
```

- [ ] **Step 3: Verify the schema migrates cleanly**

Run: `npm start`, open the app (triggers `initDb()` on launch).
Expected: App boots with no SQLite errors in the Metro/console log. (If you have a prior build with an older DB file, `CREATE TABLE IF NOT EXISTS` is additive and safe — no data loss.)

- [ ] **Step 4: Commit**

```bash
git add src/lib/db.ts src/features/home/services/plateauTipsLocalService.ts
git commit -m "Added a local plateau_tips cache table and service"
```

---

### Task 4: Create the `plateau-suggestion` Supabase Edge Function

**Files:**
- Create: `supabase/functions/plateau-suggestion/index.ts`
- Create (if missing): `supabase/config.toml` (via `supabase init`)

**Interfaces:**
- Produces: an HTTP endpoint invoked as `supabase.functions.invoke("plateau-suggestion", { body: {...} })` from the client (Task 5). Request body: `{ exerciseName: string; muscleGroup: string | null; weight: number; reps: number; sessionsStuck: number }`. Success response: `{ tip: string }`. Error response: `{ error: string }` with a non-2xx status.

- [ ] **Step 1: Initialize the Supabase CLI project (if `supabase/` doesn't exist yet)**

Run: `ls supabase 2>/dev/null || npx supabase init`
Expected: creates `supabase/config.toml`. This repo has no Edge Functions yet, so this is the first one.

- [ ] **Step 2: Write the function**

```ts
// supabase/functions/plateau-suggestion/index.ts
const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type PlateauRequest = {
  exerciseName: string;
  muscleGroup: string | null;
  weight: number;
  reps: number;
  sessionsStuck: number;
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = (await req.json()) as Partial<PlateauRequest>;
    const { exerciseName, muscleGroup, weight, reps, sessionsStuck } = body;

    if (!exerciseName || typeof weight !== "number" || typeof reps !== "number") {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const prompt =
      `You are a concise strength coach. A lifter is stuck at ${weight} lb x ${reps} reps ` +
      `on ${exerciseName}${muscleGroup ? ` (${muscleGroup})` : ""} for the last ${sessionsStuck ?? 3} ` +
      `sessions with no improvement. In ONE short, actionable sentence (max 25 words), suggest a ` +
      `specific way to break the plateau. No preamble, no greeting, just the tip.`;

    const geminiRes = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: 60, temperature: 0.7 },
      }),
    });

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      return new Response(JSON.stringify({ error: `Gemini error: ${errText}` }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await geminiRes.json();
    const tip: string | undefined = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!tip) {
      return new Response(JSON.stringify({ error: "No tip generated" }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ tip }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
```

- [ ] **Step 3: Set the Gemini API key as a Supabase secret**

The Gemini key must be a **new** key — the original one pasted earlier in chat should be treated as compromised and rotated in Google AI Studio first.

Run (replace `<project-ref>` with the value from `supabase.ts`'s `EXPO_PUBLIC_SUPABASE_URL`, or fetch it via the Supabase MCP `get_project_url` tool):

```bash
npx supabase link --project-ref <project-ref>
npx supabase secrets set GEMINI_API_KEY=<new-rotated-key>
```

Expected: `Finished supabase secrets set.`

- [ ] **Step 4: Deploy the function**

Run: `npx supabase functions deploy plateau-suggestion`
Expected: `Deployed Function plateau-suggestion`. (Alternatively, use the Supabase MCP `deploy_edge_function` tool with the same file contents.)

- [ ] **Step 5: Verify with a direct curl**

Run (replace `<project-ref>` and `<anon-key>` from `EXPO_PUBLIC_SUPABASE_URL`/`EXPO_PUBLIC_SUPABASE_ANON_KEY`):

```bash
curl -s -X POST "https://<project-ref>.supabase.co/functions/v1/plateau-suggestion" \
  -H "Authorization: Bearer <anon-key>" \
  -H "Content-Type: application/json" \
  -d '{"exerciseName":"Bench Press","muscleGroup":"chest","weight":110,"reps":8,"sessionsStuck":3}'
```

Expected: a JSON body like `{"tip":"..."}` with a short actionable sentence, HTTP 200.

- [ ] **Step 6: Commit**

```bash
git add supabase/
git commit -m "Added a plateau-suggestion edge function backed by Gemini"
```

---

### Task 5: Write the `usePlateauTracker` hook

**Files:**
- Create: `src/features/home/hooks/usePlateauTracker.ts`

**Interfaces:**
- Consumes:
  - `detectPlateaus`, `PlateauResult` from `src/features/home/core/detectPlateaus.ts` (Task 2)
  - `toExerciseProgress` from `src/features/home/core/toExerciseProgress.ts` (Task 1)
  - `listLoggedWorkouts` from `src/features/home/services/ProgressiveOverloadDao/progressiveOverloadDao.ts` (existing)
  - `getCachedTip`, `saveCachedTip` from `src/features/home/services/plateauTipsLocalService.ts` (Task 3)
  - `supabase` from `src/lib/supabase.ts` (existing)
  - `useAuth` from `src/features/auth` (existing, exposes `userId: string | null`)
- Produces:
  ```ts
  export type PlateauWithTip = PlateauResult & { tip: string | null };
  export function usePlateauTracker(): { plateaus: PlateauWithTip[] };
  ```
  Task 6 (`PlateauCard`) imports `usePlateauTracker` by this exact name; `tip: null` means "loading."

- [ ] **Step 1: Write the hook**

```ts
// src/features/home/hooks/usePlateauTracker.ts
import { useAuth } from "@/src/features/auth";
import { detectPlateaus, type PlateauResult } from "@/src/features/home/core/detectPlateaus";
import { toExerciseProgress } from "@/src/features/home/core/toExerciseProgress";
import { listLoggedWorkouts } from "@/src/features/home/services/ProgressiveOverloadDao/progressiveOverloadDao";
import {
  getCachedTip,
  saveCachedTip,
} from "@/src/features/home/services/plateauTipsLocalService";
import { supabase } from "@/src/lib/supabase";
import { useEffect, useMemo, useState } from "react";

const DETECTION_LIMIT = 12;

export type PlateauWithTip = PlateauResult & { tip: string | null };

function tipKey(p: PlateauResult): string {
  return `${p.name}|${p.weight}|${p.reps}`;
}

export function usePlateauTracker(): { plateaus: PlateauWithTip[] } {
  const { userId } = useAuth();

  const plateaus = useMemo<PlateauResult[]>(() => {
    if (!userId) return [];
    const exercises = toExerciseProgress(listLoggedWorkouts(userId, DETECTION_LIMIT));
    return detectPlateaus(exercises);
  }, [userId]);

  const [tips, setTips] = useState<Record<string, string | null>>({});

  useEffect(() => {
    if (!userId) return;

    for (const p of plateaus) {
      const key = tipKey(p);
      const cached = getCachedTip(userId, p.name, p.weight, p.reps);

      if (cached) {
        setTips((prev) => (prev[key] === cached ? prev : { ...prev, [key]: cached }));
        continue;
      }

      setTips((prev) => (key in prev ? prev : { ...prev, [key]: null }));

      supabase.functions
        .invoke<{ tip: string }>("plateau-suggestion", {
          body: {
            exerciseName: p.name,
            muscleGroup: p.muscleGroup,
            weight: p.weight,
            reps: p.reps,
            sessionsStuck: p.sessionsStuck,
          },
        })
        .then(({ data, error }) => {
          if (error || !data?.tip) return;
          saveCachedTip(userId, p.name, p.weight, p.reps, data.tip);
          setTips((prev) => ({ ...prev, [key]: data.tip }));
        })
        .catch(() => {});
    }
    // Runs whenever the detected plateau set changes (i.e. userId changes,
    // since `plateaus` is memoized on userId) — not on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, plateaus]);

  const withTips: PlateauWithTip[] = plateaus.map((p) => ({
    ...p,
    tip: tips[tipKey(p)] ?? null,
  }));

  return { plateaus: withTips };
}
```

- [ ] **Step 2: Verify manually in the app**

This step is folded into Task 7's end-to-end verification (the hook has no meaningful standalone behavior without the UI and real session data). Skip a separate verification pass here.

- [ ] **Step 3: Commit**

```bash
git add src/features/home/hooks/usePlateauTracker.ts
git commit -m "Added a hook that detects plateaus and fetches cached or fresh AI tips"
```

---

### Task 6: Build the `PlateauCard` component and wire it into Home

**Files:**
- Create: `src/features/home/components/PlateauCard.tsx`
- Modify: `src/features/home/components/index.ts`
- Modify: `src/features/home/screens/HomeScreen.tsx`

**Interfaces:**
- Consumes: `usePlateauTracker` from `src/features/home/hooks/usePlateauTracker.ts` (Task 5).

- [ ] **Step 1: Write the component**

```tsx
// src/features/home/components/PlateauCard.tsx
import { FontFamilies, Palette } from "@/constants/theme";
import { Feather } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { usePlateauTracker } from "../hooks/usePlateauTracker";

export function PlateauCard() {
  const { plateaus } = usePlateauTracker();

  if (plateaus.length === 0) return null;

  return (
    <Animated.View entering={FadeInDown.delay(200).duration(400)} style={styles.section}>
      <Text style={styles.title}>Plateaus</Text>
      <View style={{ gap: 10 }}>
        {plateaus.map((p) => (
          <View key={p.name} style={styles.card}>
            <View style={styles.head}>
              <Feather name="alert-triangle" size={14} color={Palette.danger} />
              <Text style={styles.name} numberOfLines={1}>
                {p.name}
              </Text>
            </View>
            <Text style={styles.stuck}>
              Stuck at {p.weight} lb × {p.reps} for {p.sessionsStuck} sessions
            </Text>
            {p.tip ? (
              <Text style={styles.tip}>💡 {p.tip}</Text>
            ) : (
              <Text style={styles.tipLoading}>Finding a way through…</Text>
            )}
          </View>
        ))}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  section: { marginHorizontal: 20, marginTop: 24, gap: 12 },
  title: {
    color: Palette.bone,
    fontSize: 22,
    fontFamily: FontFamilies.displayMedium,
    letterSpacing: -0.5,
  },
  card: {
    borderRadius: 14,
    backgroundColor: "rgba(248,113,113,0.05)",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(248,113,113,0.2)",
    padding: 14,
    gap: 6,
  },
  head: { flexDirection: "row", alignItems: "center", gap: 8 },
  name: {
    color: Palette.bone,
    fontSize: 13,
    fontFamily: FontFamilies.semibold,
    letterSpacing: 0.1,
    flex: 1,
  },
  stuck: {
    color: Palette.muted,
    fontSize: 11,
    fontFamily: FontFamilies.regular,
    letterSpacing: 0.2,
  },
  tip: {
    color: Palette.bone,
    fontSize: 12,
    fontFamily: FontFamilies.regular,
    letterSpacing: 0.2,
    lineHeight: 17,
    marginTop: 2,
  },
  tipLoading: {
    color: Palette.muted,
    fontSize: 11,
    fontFamily: FontFamilies.regular,
    fontStyle: "italic",
  },
});
```

- [ ] **Step 2: Export it from the barrel**

In `src/features/home/components/index.ts`, add (alphabetically, after `PersonalRecord`):

```ts
export { PlateauCard } from "./PlateauCard";
```

- [ ] **Step 3: Wire it into HomeScreen**

In `src/features/home/screens/HomeScreen.tsx`, add `PlateauCard` to the import from `@/src/features/home/components`:

```tsx
import {
  PlateauCard,
  ProgressiveOverload,
  ScheduleBar,
  TodaysWorkoutSection,
} from "@/src/features/home/components";
```

And render it directly below `ProgressiveOverload` inside the existing `gap: 14` wrapper:

```tsx
          <View style={{ gap: 14 }}>
            {/* <HomePageChartGraph />x */}
            <ProgressiveOverload />
            <PlateauCard />
            {/* <WeeklyVolume /> */}
          </View>
```

- [ ] **Step 4: Commit**

```bash
git add src/features/home/components/PlateauCard.tsx src/features/home/components/index.ts src/features/home/screens/HomeScreen.tsx
git commit -m "Surfaced plateaued exercises with an AI tip on the Home screen"
```

---

### Task 7: End-to-end manual verification

**Files:** none (verification only).

- [ ] **Step 1: Seed plateau data**

You need one exercise with at least 4 completed sessions where the last 3 have no new PR. The fastest way: log 4 sessions through the actual app UI for the same workout/exercise, e.g. Bench Press at 100x8, 110x8, 110x8, 110x6 (in that chronological order — oldest session first).

If you'd rather not manually play through 4 sessions, insert directly into the local SQLite DB for a quick check (development only — never do this against production data):

Run inside the app's JS debugger console (or a temporary debug button) something equivalent to what `logSet.ts`/`finishSession.ts` already do — since this repo's session-writing services are the source of truth, prefer the real UI flow over hand-crafted SQL to avoid drifting from the actual schema/constraints.

- [ ] **Step 2: Confirm the badge appears**

Open Home. Expected: a "Plateaus" card appears below "Your Progress" showing "Bench Press — Stuck at 110 lb × 8 for 3 sessions" with "Finding a way through…" initially.

- [ ] **Step 3: Confirm the AI tip loads**

Wait a few seconds (edge function round-trip). Expected: "Finding a way through…" is replaced by a 💡 tip sentence. Check Metro logs for any `supabase.functions.invoke` error if it doesn't appear — most likely cause is the edge function not deployed (Task 4) or the secret not set.

- [ ] **Step 4: Confirm caching**

Reload the app (or navigate away from and back to Home). Expected: the tip appears immediately with no "Finding a way through…" flash, since it's now read from `plateau_tips` instead of re-calling the edge function.

- [ ] **Step 5: Confirm a new PR clears the plateau**

Log one more session for the same exercise with a heavier weight or more reps than 110x8 (e.g. 115x8). Expected: on the next Home load, the "Plateaus" card either disappears (if no other exercise is plateaued) or no longer lists Bench Press.

---

## Task Order Summary

1. Extract `toExerciseProgress` into core (no behavior change)
2. Write `detectPlateaus` (pure, verified standalone)
3. Add `plateau_tips` table + local service
4. Add and deploy the `plateau-suggestion` edge function
5. Write `usePlateauTracker` hook (ties 2+3+4 together)
6. Build `PlateauCard` and wire into Home
7. End-to-end manual verification
