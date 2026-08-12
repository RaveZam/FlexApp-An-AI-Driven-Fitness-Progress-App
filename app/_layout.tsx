import { useStorageCleaner } from "@/hooks/useStorageCleaner";
import { useAuthGuard } from "@/src/features/auth/hooks/useAuthGuard";
import { useSyncScheduler } from "@/src/features/outbox";
import { ActivePlanProvider } from "@/src/features/workouts/context/ActivePlanContext";
import { initDb } from "@/src/lib/db";
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
import { useEffect, useState } from "react";
import "react-native-reanimated";

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

  useEffect(() => {
    initDb().then(() => setDbReady(true));
  }, []);

  const { checking, allowed } = useAuthGuard();
  useSyncScheduler(allowed);

  if (!loaded || !dbReady || checking) {
    return null;
  }

  return (
    <ActivePlanProvider>
      <AppThemeProvider>
        <RootLayoutNav />
      </AppThemeProvider>
    </ActivePlanProvider>
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
