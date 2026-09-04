import { supabase } from "@/src/lib/supabase";
import { clearDeviceTrust } from "@/src/lib/device-trust";
import { wipeLocalDb } from "@/src/lib/dao/settings";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
});

export function signInWithEmail(email: string, password: string) {
  return supabase.auth.signInWithPassword({ email, password });
}

export function signUpWithEmail(email: string, password: string) {
  return supabase.auth.signUp({ email, password });
}

// AppAuth keeps exactly one pending authorization session. Starting a second
// sign-in finishes the first one, and when the first one's OAuth redirect then
// arrives it's handed to a completed session — which raises an uncatchable
// native exception and kills the app. So a re-entrant call is a no-op.
let signInFlight = false;

export async function signInWithGoogle(): Promise<{
  error: Error | null;
  cancelled?: boolean;
}> {
  if (signInFlight) return { error: null, cancelled: true };
  signInFlight = true;
  try {
    await GoogleSignin.hasPlayServices();
    const response = await GoogleSignin.signIn();
    // The library resolves rather than throws on cancel, so this is the only
    // place a dismissed sheet can be caught.
    if (response.type === "cancelled") return { error: null, cancelled: true };

    // Read the token off the sign-in response, not getTokens(): getTokens()
    // refreshes a keychain-restored user, and that refresh can come back
    // without an ID token.
    const { idToken } = response.data;
    if (!idToken) {
      return { error: new Error("No ID token returned from Google.") };
    }
    const { error } = await supabase.auth.signInWithIdToken({
      provider: "google",
      token: idToken,
    });
    return { error };
  } catch (error: any) {
    return { error };
  } finally {
    signInFlight = false;
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    // Without this the offline grace window would let the user straight
    // back in.
    clearDeviceTrust();
    if (error) return { error };
    // Drop all local rows so the next sign-in can't briefly show the previous
    // user's data before the download sync repopulates from Supabase.
    wipeLocalDb();
    return { error: null };
  } catch {
    return {
      error: new Error("An unexpected error occurred during logout."),
    };
  }
}
