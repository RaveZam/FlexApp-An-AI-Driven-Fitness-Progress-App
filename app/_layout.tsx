import { AuthProvider } from "@/auth/useAuth";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import Popup from "@/components/ui/Popup";
import WorkoutContextProvider from "@/context/workoutContext"; // ✅ use the default export (which is the provider)
import { useColorScheme } from "@/hooks/useColorScheme";
import { useWorkoutContext } from "@/hooks/useWorkoutPlanContext";

// Component to handle the success popup
function WorkoutSuccessPopup() {
  const { showSuccessPopup, handleSuccessPopupClose } = useWorkoutContext();

  return (
    <Popup
      isVisible={showSuccessPopup}
      onClose={handleSuccessPopupClose}
      iconName="checkcircle"
      iconColor="#10b981"
      message="Workout plan added successfully!"
      buttons={[
        {
          text: "Continue",
          onPress: handleSuccessPopupClose,
        },
      ]}
    />
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
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
          <WorkoutSuccessPopup />
        </ThemeProvider>
      </WorkoutContextProvider>
    </AuthProvider>
  );
}
