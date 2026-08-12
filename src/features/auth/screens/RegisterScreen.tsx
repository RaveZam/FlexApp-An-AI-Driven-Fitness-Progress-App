import { useRegister } from "@/src/features/auth/hooks/useRegister";
import useSessionRedirect from "@/src/features/auth/hooks/useSessionRedirect";
import LoadingOverlay from "@/components/ui/LoadingOverlay";
import { usePalette } from "@/src/theme";
import { AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RegisterScreen() {
  const p = usePalette();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signUp, signInWithGoogle, loading } = useRegister();
  useSessionRedirect();

  const handleRegister = () => signUp(email, password);
  const handleGoogleSignup = () => signInWithGoogle();

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 px-6 justify-center" style={{ backgroundColor: p.ink }}>
        <Text className="text-3xl font-bold mb-8" style={{ color: p.bone }}>
          Create Account
        </Text>

        <Text className="mb-2" style={{ color: p.bone }}>Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
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
          onSubmitEditing={handleRegister}
        />

        <TouchableOpacity
          onPress={handleRegister}
          className="rounded-xl py-3"
          style={{ backgroundColor: p.accent }}
        >
          <Text className="text-center font-semibold text-base" style={{ color: p.onAccent }}>
            Register
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
          onPress={handleGoogleSignup}
        >
          <AntDesign name="google" size={18} color="#000" />
          <Text className="text-center text-black font-semibold text-base ml-2">
            Continue with Google
          </Text>
        </TouchableOpacity>

        <Text className="text-center mt-6" style={{ color: p.muted }}>
          Already have an account?{" "}
          <Text
            onPress={() => router.replace("/login")}
            style={{ color: p.accent }}
          >
            Login
          </Text>
        </Text>
        <LoadingOverlay isVisible={loading} />
      </View>
    </SafeAreaView>
  );
}
