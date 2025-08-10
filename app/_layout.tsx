import { AuthProvider } from "@/auth/useAuth";
import WorkoutContextProvider from "@/context/workoutContext"; // ✅ use the default export (which is the provider)
import { useColorScheme } from "@/hooks/useColorScheme";
import { useStorageCleaner } from "@/hooks/useStorageCleaner";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import * as NavigationBar from "expo-navigation-bar";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

export default function RootLayout() {
  NavigationBar.setVisibilityAsync("hidden");
  const colorScheme = useColorScheme();
  useStorageCleaner();

  const [loaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <WorkoutContextProvider>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </WorkoutContextProvider>
    </AuthProvider>
  );
}
