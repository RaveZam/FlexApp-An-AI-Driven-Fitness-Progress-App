import { Stack } from "expo-router";

export default function Workouts() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="PlanDetails" options={{ headerShown: false }} />
      <Stack.Screen name="CreatePlanScreen" options={{ headerShown: false }} />
      <Stack.Screen name="WorkoutSelector" options={{ headerShown: false }} />
      <Stack.Screen name="Summary" options={{ headerShown: false }} />
      <Stack.Screen
        name="CustomWorkoutCreator"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="WorkoutScreen"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
