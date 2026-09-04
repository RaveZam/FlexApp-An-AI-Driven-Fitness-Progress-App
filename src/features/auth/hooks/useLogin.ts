import { downloadUserData } from "@/src/features/auth/services/authGate";
import {
  signInWithEmail,
  signInWithGoogle as signInWithGoogleService,
} from "@/src/features/auth/services/authService";
import { router } from "expo-router";
import { useState } from "react";

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    const { error } = await signInWithEmail(email.trim(), password.trim());

    if (error) {
      setLoading(false);
      setErrorMessage(mapSignInError(error.message));
      return;
    }
    // Pull the account's data into SQLite before entering the app so the first
    // screen render isn't against an empty database.
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
      setErrorMessage(
        `Google sign-in failed: ${error.message ?? "Unknown error"}`,
      );
      return;
    }
    setLoading(true);
    await downloadUserData();
    setLoading(false);
    router.replace("/");
  };

  const dismissError = () => setErrorMessage(null);

  return {
    signIn,
    signInWithGoogle,
    loading,
    googleLoading,
    errorMessage,
    dismissError,
  };
}

function mapSignInError(message: string): string {
  if (message === "Invalid login credentials") {
    return "Invalid email or password. Please try again.";
  }
  if (message === "Email not confirmed") {
    return "Please confirm your email address before logging in.";
  }
  return "An unexpected error occurred. Please try again.";
}
