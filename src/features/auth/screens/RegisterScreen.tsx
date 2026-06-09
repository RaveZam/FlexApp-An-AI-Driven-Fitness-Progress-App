import { useAuth } from "@/src/features/auth/hooks/useAuth";
import LoadingOverlay from "@/components/ui/LoadingOverlay";
import { AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signUp, signInWithGoogle, session } = useAuth();

  useEffect(() => {
    if (session) {
      router.replace("/");
    }
  }, [session]);

  const handleRegister = async () => {
    setLoading(true);
    const { error } = await signUp(email.trim(), password.trim());
    setLoading(false);
    if (error) Alert.alert("Signup Failed", error.message);
    else Alert.alert("Success", "Please check your email to confirm");
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    const { error, cancelled } = await signInWithGoogle();
    setLoading(false);

    if (cancelled) return;
    if (error) {
      Alert.alert(
        "Google sign-in failed",
        error.message ?? "Unknown error"
      );
    } else {
      router.replace("/");
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 bg-[#0f0f0f] px-6 justify-center">
        <Text className="text-3xl font-bold text-white mb-8">
          Create Account
        </Text>

        <Text className="text-white mb-2">Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
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
          onSubmitEditing={handleRegister}
        />

        <TouchableOpacity
          onPress={handleRegister}
          className="bg-emerald-500 rounded-xl py-3"
        >
          <Text className="text-center text-black font-semibold text-base">
            Register
          </Text>
        </TouchableOpacity>

        <View className="flex-row items-center my-6">
          <View className="flex-1 h-px bg-gray-700" />
          <Text className="text-gray-500 mx-3">or</Text>
          <View className="flex-1 h-px bg-gray-700" />
        </View>

        <TouchableOpacity
          className="bg-white rounded-xl py-3 flex-row items-center justify-center"
          onPress={handleGoogleSignup}
        >
          <AntDesign name="google" size={18} color="#000" />
          <Text className="text-center text-black font-semibold text-base ml-2">
            Continue with Google
          </Text>
        </TouchableOpacity>

        <Text className="text-center text-gray-400 mt-6">
          Already have an account?{" "}
          <Text
            onPress={() => router.replace("/login")}
            className="text-emerald-400"
          >
            Login
          </Text>
        </Text>
        <LoadingOverlay isVisible={loading} />
      </View>
    </SafeAreaView>
  );
}
