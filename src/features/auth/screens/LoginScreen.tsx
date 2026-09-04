import ActionButton from "@/components/ui/ActionButton";
import LoadingOverlay from "@/components/ui/LoadingOverlay";
import Popup from "@/components/ui/Popup";
import {
  AuthBrand,
  AuthDivider,
  AuthField,
  GoogleButton,
} from "@/src/features/auth/components";
import { useLogin } from "@/src/features/auth/hooks/useLogin";
import useSessionRedirect from "@/src/features/auth/hooks/useSessionRedirect";
import { usePalette } from "@/src/theme";
import { router } from "expo-router";
import React, { useState } from "react";
import { Text, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
  const p = usePalette();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const {
    signIn,
    signInWithGoogle,
    loading,
    googleLoading,
    errorMessage,
    dismissError,
  } = useLogin();
  const offline = useSessionRedirect();

  const handleLogin = () => signIn(email, password);

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: p.ink }}>
      <View className="flex-1 px-6 justify-center">
        <AuthBrand
          title="Welcome back"
          subtitle="Pick up where your last session left off."
        />

        <Animated.View entering={FadeIn.duration(320).delay(120)}>
          {offline && (
            <Text
              className="mb-5"
              style={{ color: p.danger, fontSize: 13 }}
            >
              No connection — reconnect to sign in.
            </Text>
          )}

          <AuthField
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="you@email.com"
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
            autoComplete="current-password"
            returnKeyType="done"
            onSubmitEditing={handleLogin}
          />

          <View className="mt-2">
            <ActionButton
              onPress={handleLogin}
              title="Log in"
              disabled={offline}
            />
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
            New to FlexLife?{" "}
            <Text
              onPress={() => router.replace("/register")}
              style={{ color: p.accent }}
            >
              Create account
            </Text>
          </Text>
        </Animated.View>

        <LoadingOverlay isVisible={loading} />
        <Popup
          isVisible={errorMessage !== null}
          onClose={dismissError}
          iconName="alert-circle-outline"
          iconColor={p.danger}
          message={errorMessage ?? ""}
          buttons={[{ text: "OK", onPress: dismissError }]}
        />
      </View>
    </SafeAreaView>
  );
}
