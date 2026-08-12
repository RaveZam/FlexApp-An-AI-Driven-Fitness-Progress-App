import { getSetting, setSetting } from "@/src/lib/dao/settings";

const CURRENT_USER_ID_KEY = "current_user_id";
const CURRENT_USER_NAME_KEY = "current_user_name";
const CURRENT_USER_EMAIL_KEY = "current_user_email";
const CURRENT_USER_AVATAR_URL_KEY = "current_user_avatar_url";

let cachedUserId: string | null = null;
let cachedUserName: string | null = null;
let cachedUserEmail: string | null = null;
let cachedUserAvatarUrl: string | null = null;

export function setCurrentUserId(userId: string | null): void {
  cachedUserId = userId;
  setSetting(CURRENT_USER_ID_KEY, userId);
}

/** Null only when nobody has signed in on this device yet. */
export function getCurrentUserId(): string | null {
  if (cachedUserId === null) cachedUserId = getSetting(CURRENT_USER_ID_KEY);
  return cachedUserId;
}

export function setCurrentUserName(name: string | null): void {
  cachedUserName = name;
  setSetting(CURRENT_USER_NAME_KEY, name);
}

export function getCurrentUserName(): string | null {
  if (cachedUserName === null) cachedUserName = getSetting(CURRENT_USER_NAME_KEY);
  return cachedUserName;
}

export function setCurrentUserEmail(email: string | null): void {
  cachedUserEmail = email;
  setSetting(CURRENT_USER_EMAIL_KEY, email);
}

export function getCurrentUserEmail(): string | null {
  if (cachedUserEmail === null) cachedUserEmail = getSetting(CURRENT_USER_EMAIL_KEY);
  return cachedUserEmail;
}

export function setCurrentUserAvatarUrl(avatarUrl: string | null): void {
  cachedUserAvatarUrl = avatarUrl;
  setSetting(CURRENT_USER_AVATAR_URL_KEY, avatarUrl);
}

export function getCurrentUserAvatarUrl(): string | null {
  if (cachedUserAvatarUrl === null) {
    cachedUserAvatarUrl = getSetting(CURRENT_USER_AVATAR_URL_KEY);
  }
  return cachedUserAvatarUrl;
}
