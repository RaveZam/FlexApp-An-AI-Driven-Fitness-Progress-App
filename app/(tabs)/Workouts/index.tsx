import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import Button from "@/components/ui/Button";
import { useRouter } from "expo-router";

export default function index() {
  const router = useRouter();
  return (
    <ThemedView className="flex-1 justify-center">
      <ThemedView className="flex-1 justify-center">
        <ThemedText className="text-center text-lg font-medium opacity-60">
          You Have No Workout Plans...
        </ThemedText>
      </ThemedView>

      <Button
        buttonText="Create Workout"
        onPress={() => router.push("/Workouts/CreatePlanScreen" as never)}
      />
    </ThemedView>
  );
}
