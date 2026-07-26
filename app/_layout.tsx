import { useStorageCleaner } from "@/hooks/useStorageCleaner";
import { AuthProvider } from "@/src/features/auth/hooks/useAuth";
import { ActivePlanProvider } from "@/src/features/workouts/context/ActivePlanContext";
import { initDb } from "@/src/lib/db";
import { runOutboxSync } from "@/src/features/outbox";
import {
  Palettes,
  ThemeProvider as AppThemeProvider,
  useTheme,
} from "@/src/theme";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import {
  Outfit_200ExtraLight,
  Outfit_300Light,
  Outfit_400Regular,
  Outfit_500Medium,
  Outfit_600SemiBold,
} from "@expo-google-fonts/outfit";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SystemUI from "expo-system-ui";
import { useEffect, useRef, useState } from "react";
import { AppState, type AppStateStatus } from "react-native";
import "react-native-reanimated";

const SYNC_INTERVAL_MS = 30_000;

export default function RootLayout() {
  useStorageCleaner();

  const [loaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Outfit_200ExtraLight,
    Outfit_300Light,
    Outfit_400Regular,
    Outfit_500Medium,
    Outfit_600SemiBold,
  });

  const [dbReady, setDbReady] = useState(false);
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    initDb().then(() => {
      setDbReady(true);
      runOutboxSync();
    });

    // Sync when app returns to foreground
    const subscription = AppState.addEventListener(
      "change",
      (next: AppStateStatus) => {
        if (appState.current.match(/inactive|background/) && next === "active") {
          runOutboxSync();
        }
        appState.current = next;
      }
    );

    // Periodic sync while app is active
    const interval = setInterval(() => {
      if (AppState.currentState === "active") {
        runOutboxSync();
      }
    }, SYNC_INTERVAL_MS);

    return () => {
      subscription.remove();
      clearInterval(interval);
    };
  }, []);

  if (!loaded || !dbReady) {
    return null;
  }

  return (
    <AuthProvider>
      <ActivePlanProvider>
        <AppThemeProvider>
          <RootLayoutNav />
        </AppThemeProvider>
      </ActivePlanProvider>
    </AuthProvider>
  );
}

function RootLayoutNav() {
  const { scheme } = useTheme();

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(Palettes[scheme].ink);
  }, [scheme]);

  return (
    <ThemeProvider value={scheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style={scheme === "dark" ? "light" : "dark"} />
    </ThemeProvider>
  );
}
