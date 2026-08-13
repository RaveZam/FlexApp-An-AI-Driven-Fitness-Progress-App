import { supabase } from "@/src/lib/supabase";
import { clearDeviceTrust } from "@/src/lib/device-trust";
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

export async function signInWithGoogle(): Promise<{
  error: Error | null;
  cancelled?: boolean;
}> {
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
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    // Without this the offline grace window would let the user straight
    // back in.
    clearDeviceTrust();
    if (error) return { error };
    return { error: null };
  } catch {
    return {
      error: new Error("An unexpected error occurred during logout."),
    };
  }
}
