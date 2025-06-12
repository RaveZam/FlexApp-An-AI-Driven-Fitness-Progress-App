import { Stack } from "expo-router";

export default function Workouts() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="CreatePlanScreen" options={{ headerShown: false }} />
    </Stack>
  );
}
