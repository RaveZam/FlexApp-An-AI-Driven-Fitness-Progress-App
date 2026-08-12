export const GRACE_WINDOW_DAYS = 7;
const GRACE_WINDOW_MS = GRACE_WINDOW_DAYS * 24 * 60 * 60 * 1000;

export type AuthGateInput = {
  hasSession: boolean;
  onAuthRoute: boolean;
  online: boolean;
  lastVerifiedAt: string | null;
  now: Date;
};

export type AuthRedirect = "/login" | "/" | null;

export function isAuthAllowed(input: AuthGateInput): boolean {
  return input.hasSession || isTrustValid(input);
}

export function resolveAuthRedirect(input: AuthGateInput): AuthRedirect {
  if (!isAuthAllowed(input)) return input.onAuthRoute ? null : "/login";
  return input.onAuthRoute ? "/" : null;
}

// This will run if the token is "expired" so as a catch we will check if the
// user has simply signed in within the 7 day grace window
export function isTrustValid(input: AuthGateInput): boolean {
  if (input.online) return false;
  if (input.lastVerifiedAt === null) return false;

  const verifiedAt = new Date(input.lastVerifiedAt);
  if (isNaN(verifiedAt.getTime())) return false;

  const age = input.now.getTime() - verifiedAt.getTime();
  return age < GRACE_WINDOW_MS;
}
