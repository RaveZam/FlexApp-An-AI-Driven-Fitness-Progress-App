import type { RefObject } from "react";
import { supabase } from "@/src/lib/supabase";
import { initDb } from "@/src/lib/db";
import { runDownloadSync } from "@/src/features/outbox";
import { isWifiConnected } from "@/src/lib/network";
import { type AuthGateInput } from "@/src/features/auth/core/resolveAuthRedirect";
import { markSessionVerified, getLastVerifiedAt } from "@/src/lib/device-trust";

/**
 * Checks for a session and marks device trust with a timestamp, then runs
 * the download sync once per app process after the checks.
 */
export async function readAuthGate(
  pathname: string,
  downloaded: RefObject<boolean>,
): Promise<AuthGateInput> {
  await initDb();
  const { data } = await supabase.auth.getSession();
  const session = data?.session ?? null;

  if (session) {
    markSessionVerified(session.user);
    if (!downloaded.current) {
      await runDownloadSync(session.user.id);
      downloaded.current = true;
    }
  }

  return {
    hasSession: session !== null,
    onAuthRoute: pathname.startsWith("/login") || pathname.startsWith("/register"),
    // Only worth asking when there's no session — that's the only case where
    // the answer changes the decision.
    online: session !== null ? true : await isWifiConnected(),
    lastVerifiedAt: getLastVerifiedAt(),
    now: new Date(),
  };
}
