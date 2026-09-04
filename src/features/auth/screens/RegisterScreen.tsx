import ActionButton from "@/components/ui/ActionButton";
import LoadingOverlay from "@/components/ui/LoadingOverlay";
import {
  AuthBrand,
  AuthDivider,
  AuthField,
  GoogleButton,
} from "@/src/features/auth/components";
import { useRegister } from "@/src/features/auth/hooks/useRegister";
import useSessionRedirect from "@/src/features/auth/hooks/useSessionRedirect";
import { usePalette } from "@/src/theme";
import { router } from "expo-router";
import React, { useState } from "react";
import { Text, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RegisterScreen() {
  const p = usePalette();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signUp, signInWithGoogle, loading, googleLoading } = useRegister();
  useSessionRedirect();

  const handleRegister = () => signUp(email, password);

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: p.ink }}>
      <View className="flex-1 px-6 justify-center">
        <AuthBrand
          title="Start your log"
          subtitle="One account keeps every session in sync."
        />

        <Animated.View entering={FadeIn.duration(320).delay(120)}>
          <AuthField
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />

          <AuthField
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            secureTextEntry
            autoComplete="new-password"
            returnKeyType="done"
            onSubmitEditing={handleRegister}
          />

          <View className="mt-2">
            <ActionButton onPress={handleRegister} title="Create account" />
          </View>

          <AuthDivider />

          <GoogleButton
            onPress={signInWithGoogle}
            disabled={googleLoading || loading}
          />

          <Text
            className="text-center mt-7"
            style={{ color: p.muted, fontSize: 13 }}
          >
            Already have an account?{" "}
            <Text
              onPress={() => router.replace("/login")}
              style={{ color: p.accent }}
            >
              Log in
            </Text>
          </Text>
        </Animated.View>

        <LoadingOverlay isVisible={loading} />
      </View>
    </SafeAreaView>
  );
}
