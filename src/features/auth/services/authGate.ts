import { type AuthGateInput } from "@/src/features/auth/core/resolveAuthRedirect";
import { runDownloadSync } from "@/src/features/outbox";
import { initDb } from "@/src/lib/db";
import { getLastVerifiedAt, markSessionVerified } from "@/src/lib/device-trust";
import { isWifiConnected } from "@/src/lib/network";
import { supabase } from "@/src/lib/supabase";

// One download per signed-in user, shared between the reactive gate and the
// explicit call from the login flow: a login that already pulled data doesn't
// make the post-navigation gate pull it again, and two callers racing (the
// login flow and useSessionRedirect on the same screen) share one download
// instead of firing two. Keyed on the user id so signing out and back in as a
// different account downloads again rather than no-opping onto a wiped DB.
let downloadedFor: string | null = null;
let downloadInFlight: Promise<void> | null = null;

async function downloadOnce(userId: string): Promise<void> {
  if (downloadedFor === userId) return;
  if (!downloadInFlight) {
    downloadInFlight = runDownloadSync(userId).then(() => {
      downloadedFor = userId;
      downloadInFlight = null;
    });
  }
  await downloadInFlight;
}

/**
 * Bring local state up to date for a freshly authenticated session: record the
 * user so `getCurrentUserId()` resolves synchronously, then pull remote data
 * into SQLite.
 *
 * Await this before navigating into the app (`router.replace("/")`) from a
 * sign-in / sign-up flow. Navigating first lets the first screen mount and read
 * an empty database before the download lands. No-ops when there is no session.
 */
export async function downloadUserData(): Promise<void> {
  try {
    await initDb();
    const { data } = await supabase.auth.getSession();
    const session = data?.session ?? null;
    if (!session) return;

    markSessionVerified(session.user);
    await downloadOnce(session.user.id);
  } catch (error) {
    // Don't strand the caller on a spinner — let it navigate; the reactive
    // gate and the next foreground sync get another shot at the download.
    console.warn("[downloadUserData] failed:", error);
  }
}

/**
 * Checks for a session and marks device trust with a timestamp, then runs
 * the download sync once per app process after the checks.
 */
export async function readAuthGate(pathname: string): Promise<AuthGateInput> {
  await initDb();
  const { data } = await supabase.auth.getSession();
  const session = data?.session ?? null;

  if (session) {
    markSessionVerified(session.user);
    await downloadOnce(session.user.id);
  }

  return {
    hasSession: session !== null,
    onAuthRoute:
      pathname.startsWith("/login") || pathname.startsWith("/register"),
    // Only worth asking when there's no session — that's the only case where
    // the answer changes the decision.
    online: session !== null ? true : await isWifiConnected(),
    lastVerifiedAt: getLastVerifiedAt(),
    now: new Date(),
  };
}
