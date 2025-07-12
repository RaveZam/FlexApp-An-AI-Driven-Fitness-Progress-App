import { Stack } from "expo-router";

export default function CustomWorkoutCreatorLayout() {
  return (
    <Stack initialRouteName="index">
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          headerBackTitle: "Back",
          headerBackVisible: true,
          headerTitle: "Create Custom Workout",
        }}
      />
    </Stack>
  );
}
