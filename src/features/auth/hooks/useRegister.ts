import { useState } from "react";
import { router } from "expo-router";
import { Alert } from "react-native";
import {
  signUpWithEmail,
  signInWithGoogle as signInWithGoogleService,
} from "@/src/features/auth/services/authService";

export function useRegister() {
  const [loading, setLoading] = useState(false);

  const signUp = async (email: string, password: string) => {
    setLoading(true);
    const { error } = await signUpWithEmail(email.trim(), password.trim());
    setLoading(false);

    if (error) {
      Alert.alert("Signup Failed", error.message);
    } else {
      Alert.alert("Success", "Please check your email to confirm");
    }
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    const { error, cancelled } = await signInWithGoogleService();
    setLoading(false);

    if (cancelled) return;
    if (error) {
      Alert.alert("Google sign-in failed", error.message ?? "Unknown error");
      return;
    }
    router.replace("/");
  };

  return { signUp, signInWithGoogle, loading };
}
