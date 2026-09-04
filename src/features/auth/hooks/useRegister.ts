import { useState } from "react";
import { router } from "expo-router";
import { Alert } from "react-native";
import {
  signUpWithEmail,
  signInWithGoogle as signInWithGoogleService,
} from "@/src/features/auth/services/authService";
import { downloadUserData } from "@/src/features/auth/services/authGate";

export function useRegister() {
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const signUp = async (email: string, password: string) => {
    setLoading(true);
    const { data, error } = await signUpWithEmail(email.trim(), password.trim());

    if (error) {
      setLoading(false);
      Alert.alert("Signup Failed", error.message);
      return;
    }

    // With email confirmation on, signUp returns no session — the user has to
    // confirm before they can sign in. With it off, they're already signed in,
    // so pull their data in and enter the app.
    if (!data.session) {
      setLoading(false);
      Alert.alert("Success", "Please check your email to confirm");
      return;
    }

    await downloadUserData();
    setLoading(false);
    router.replace("/");
  };

  const signInWithGoogle = async () => {
    // Deliberately not `loading` here: that drives LoadingOverlay, a native
    // Modal, and presenting one in the same frame Google presents its own auth
    // view controller races the two presentations. A dismissed auth session
    // crashes the app when its OAuth redirect lands. Google's sheet is its own
    // full-screen UI anyway — there's nothing to cover until it returns.
    setGoogleLoading(true);
    const { error, cancelled } = await signInWithGoogleService();
    setGoogleLoading(false);

    if (cancelled) return;
    if (error) {
      Alert.alert("Google sign-in failed", error.message ?? "Unknown error");
      return;
    }
    // Pull the account's data into SQLite before entering the app so the first
    // screen render isn't against an empty database.
    setLoading(true);
    await downloadUserData();
    setLoading(false);
    router.replace("/");
  };

  return { signUp, signInWithGoogle, loading, googleLoading };
}
