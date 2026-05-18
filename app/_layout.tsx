import { useColorScheme } from "@/hooks/useColorScheme";
import { useStorageCleaner } from "@/hooks/useStorageCleaner";
import { AuthProvider } from "@/src/features/auth/hooks/useAuth";
import { initDb } from "@/src/lib/db";
import { runOutboxSync } from "@/src/features/workouts/services/syncService";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import {
  DarkTheme,
  ThemeProvider
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import { AppState, type AppStateStatus } from "react-native";
import "react-native-reanimated";

const SYNC_INTERVAL_MS = 30_000;

export default function RootLayout() {
  const colorScheme = useColorScheme();
  useStorageCleaner();

  const [loaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
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
      <ThemeProvider
        value={colorScheme === "dark" ? DarkTheme : DarkTheme}
      >
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </AuthProvider>
  );
}
