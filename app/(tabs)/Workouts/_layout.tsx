import { Stack } from "expo-router";

export default function WorkoutsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="create-plan" />
      <Stack.Screen name="plan" />
      <Stack.Screen name="templates" />
      <Stack.Screen name="session" />
      <Stack.Screen name="create" />
      <Stack.Screen name="[id]" />
    </Stack>
  );
}
