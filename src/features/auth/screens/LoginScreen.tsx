import { AntDesign } from "@expo/vector-icons";
import { useAuth } from "@/src/features/auth/hooks/useAuth";
import LoadingOverlay from "@/components/ui/LoadingOverlay";
import Popup from "@/components/ui/Popup";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
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
      <View className="flex-1 bg-[#0f0f0f] px-6 justify-center">
        <Text className="text-3xl font-bold text-white mb-8">Welcome Back</Text>

        <Text className="text-white mb-2">Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="your@email.com"
          placeholderTextColor="#9CA3AF"
          className="bg-[#1c1c1c] text-white rounded-xl px-4 py-3 mb-4 border border-transparent focus:border-emerald-500"
        />

        <Text className="text-white mb-2">Password</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••"
          placeholderTextColor="#9CA3AF"
          secureTextEntry
          className="bg-[#1c1c1c] text-white rounded-xl px-4 py-3 mb-6 border border-transparent focus:border-emerald-500"
          returnKeyType="done"
          onSubmitEditing={handleLogin}
        />

        <TouchableOpacity
          className="bg-emerald-500 rounded-xl py-3"
          onPress={handleLogin}
        >
          <Text className="text-center text-black font-semibold text-base">
            Login
          </Text>
        </TouchableOpacity>

        <View className="flex-row items-center my-6">
          <View className="flex-1 h-px bg-gray-700" />
          <Text className="text-gray-500 mx-3">or</Text>
          <View className="flex-1 h-px bg-gray-700" />
        </View>

        <TouchableOpacity
          className="bg-white rounded-xl py-3 flex-row items-center justify-center"
          onPress={handleGoogleLogin}
        >
          <AntDesign name="google" size={18} color="#000" />
          <Text className="text-center text-black font-semibold text-base ml-2">
            Continue with Google
          </Text>
        </TouchableOpacity>

        <Text className="text-center text-gray-400 mt-6">
          Don't have an account?{" "}
          <Text
            onPress={() => router.replace("/register")}
            className="text-emerald-400"
          >
            Register
          </Text>
        </Text>
        <LoadingOverlay isVisible={loading} />
        <Popup
          isVisible={isErrorPopupVisible}
          onClose={() => setErrorPopupVisible(false)}
          iconName="exclamationcircleo"
          iconColor="#FF4D4D"
          message={errorMessage}
          buttons={[{ text: "OK", onPress: () => setErrorPopupVisible(false) }]}
        />
      </View>
    </SafeAreaView>
  );
}
