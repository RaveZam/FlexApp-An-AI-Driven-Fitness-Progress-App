/**
 * Device trust: the record that a real session was confirmed on this device.
 *
 * Lives in app_settings rather than with the supabase token, because the whole
 * point is to survive the token expiring. Read by the auth gate to decide
 * whether an offline launch is a returning user or a fresh install.
 */
import {
  setCurrentUserId,
  setCurrentUserName,
  setCurrentUserEmail,
  setCurrentUserAvatarUrl,
} from "@/src/lib/current-user";
import { getSetting, setSetting } from "@/src/lib/dao/settings";
import type { User } from "@supabase/supabase-js";

const LAST_VERIFIED_KEY = "last_verified_session_at";

/**
 * Records the signed-in user's profile fields and a last-verified timestamp,
 * so sync/display code can read them synchronously and so an offline launch
 * can be recognized as a returning user (see resolveAuthRedirect's grace window).
 */
export function markSessionVerified(user: User, now: Date = new Date()): void {
  const name =
    user.user_metadata?.full_name ??
    user.user_metadata?.name ??
    user.user_metadata?.username ??
    null;
  const avatarUrl =
    user.user_metadata?.avatar_url ?? user.user_metadata?.picture ?? null;

  setCurrentUserId(user.id);
  setCurrentUserName(name);
  setCurrentUserEmail(user.email ?? null);
  setCurrentUserAvatarUrl(avatarUrl);
  setSetting(LAST_VERIFIED_KEY, now.toISOString());
}

/** ISO timestamp of the last confirmed session, or null if there's never been one. */
export function getLastVerifiedAt(): string | null {
  return getSetting(LAST_VERIFIED_KEY);
}

/** Drops this device's trust, so the next offline launch lands on sign-in. */
export function clearDeviceTrust(): void {
  setSetting(LAST_VERIFIED_KEY, null);
  setCurrentUserId(null);
  setCurrentUserName(null);
  setCurrentUserEmail(null);
  setCurrentUserAvatarUrl(null);
}
