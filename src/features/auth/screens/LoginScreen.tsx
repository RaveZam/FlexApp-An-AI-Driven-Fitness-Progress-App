import { AntDesign } from "@expo/vector-icons";
import { useAuth } from "@/src/features/auth/hooks/useAuth";
import LoadingOverlay from "@/components/ui/LoadingOverlay";
import Popup from "@/components/ui/Popup";
import { usePalette } from "@/src/theme";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
  const p = usePalette();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isErrorPopupVisible, setErrorPopupVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { signIn, signInWithGoogle, session } = useAuth();

  useEffect(() => {
    if (session) {
      router.replace("/");
    }
  }, [session]);

  const handleLogin = async () => {
    setLoading(true);
    const { error } = await signIn(email.trim(), password.trim());
    setLoading(false);

    if (error) {
      let message = "An unexpected error occurred. Please try again.";
      if (error.message === "Invalid login credentials") {
        message = "Invalid email or password. Please try again.";
      } else if (error.message === "Email not confirmed") {
        message = "Please confirm your email address before logging in.";
      }
      setErrorMessage(message);
      setErrorPopupVisible(true);
    } else {
      router.replace("/");
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    const { error, cancelled } = await signInWithGoogle();
    setLoading(false);

    if (cancelled) return;
    if (error) {
      setErrorMessage(`Google sign-in failed: ${error.message ?? "Unknown error"}`);
      setErrorPopupVisible(true);
    } else {
      router.replace("/");
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 px-6 justify-center" style={{ backgroundColor: p.ink }}>
        <Text className="text-3xl font-bold mb-8" style={{ color: p.bone }}>Welcome Back</Text>

        <Text className="mb-2" style={{ color: p.bone }}>Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="your@email.com"
          placeholderTextColor={p.mutedSoft}
          className="rounded-xl px-4 py-3 mb-4"
          style={{ backgroundColor: p.inkRaised, color: p.bone }}
        />

        <Text className="mb-2" style={{ color: p.bone }}>Password</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••"
          placeholderTextColor={p.mutedSoft}
          secureTextEntry
          className="rounded-xl px-4 py-3 mb-6"
          style={{ backgroundColor: p.inkRaised, color: p.bone }}
          returnKeyType="done"
          onSubmitEditing={handleLogin}
        />

        <TouchableOpacity
          className="rounded-xl py-3"
          style={{ backgroundColor: p.accent }}
          onPress={handleLogin}
        >
          <Text className="text-center font-semibold text-base" style={{ color: p.onAccent }}>
            Login
          </Text>
        </TouchableOpacity>

        <View className="flex-row items-center my-6">
          <View className="flex-1 h-px" style={{ backgroundColor: p.hairlineStrong }} />
          <Text className="mx-3" style={{ color: p.muted }}>or</Text>
          <View className="flex-1 h-px" style={{ backgroundColor: p.hairlineStrong }} />
        </View>

        {/* Google sign-in button stays white/black per Google's brand guidelines,
            not app-themed. */}
        <TouchableOpacity
          className="bg-white rounded-xl py-3 flex-row items-center justify-center"
          onPress={handleGoogleLogin}
        >
          <AntDesign name="google" size={18} color="#000" />
          <Text className="text-center text-black font-semibold text-base ml-2">
            Continue with Google
          </Text>
        </TouchableOpacity>

        <Text className="text-center mt-6" style={{ color: p.muted }}>
          Don't have an account?{" "}
          <Text
            onPress={() => router.replace("/register")}
            style={{ color: p.accent }}
          >
            Register
          </Text>
        </Text>
        <LoadingOverlay isVisible={loading} />
        <Popup
          isVisible={isErrorPopupVisible}
          onClose={() => setErrorPopupVisible(false)}
          iconName="alert-circle-outline"
          iconColor={p.danger}
          message={errorMessage}
          buttons={[{ text: "OK", onPress: () => setErrorPopupVisible(false) }]}
        />
      </View>
    </SafeAreaView>
  );
}
