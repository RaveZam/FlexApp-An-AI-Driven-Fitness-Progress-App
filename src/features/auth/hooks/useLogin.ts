import { useState } from "react";
import { router } from "expo-router";
import {
  signInWithEmail,
  signInWithGoogle as signInWithGoogleService,
} from "@/src/features/auth/services/authService";

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    const { error } = await signInWithEmail(email.trim(), password.trim());
    setLoading(false);

    if (error) {
      setErrorMessage(mapSignInError(error.message));
      return;
    }
    router.replace("/");
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    const { error, cancelled } = await signInWithGoogleService();
    setLoading(false);

    if (cancelled) return;
    if (error) {
      setErrorMessage(`Google sign-in failed: ${error.message ?? "Unknown error"}`);
      return;
    }
    router.replace("/");
  };

  const dismissError = () => setErrorMessage(null);

  return { signIn, signInWithGoogle, loading, errorMessage, dismissError };
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
