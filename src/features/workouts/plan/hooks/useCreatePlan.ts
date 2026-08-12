import { getCurrentUserId } from "@/src/lib/current-user";
import { generateUUID } from "@/src/lib/uuid";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert } from "react-native";
import { insertPlanLocal } from "../../services/workoutLocalService";
import type { WorkoutPlan, WorkoutPlanInput } from "../../types";

export function useCreatePlan() {
  const router = useRouter();
  const [planName, setPlanName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function createPlan(input: WorkoutPlanInput): Promise<WorkoutPlan> {
    const userId = getCurrentUserId();
    if (!userId) throw new Error("Not authenticated");

    setSaving(true);
    setError(null);

    try {
      const now = new Date().toISOString();
      const planId = generateUUID();

      const plan: WorkoutPlan = {
        id: planId,
        userId,
        name: input.name.trim(),
        createdAt: now,
        updatedAt: now,
        workouts: [],
      };

      insertPlanLocal(plan);

      return plan;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to create plan";
      setError(msg);
      throw err;
    } finally {
      setSaving(false);
    }
  }

  async function handleSave() {
    const name = planName.trim();
    if (!name) {
      Alert.alert("Name required", "Please enter a plan name.");
      return;
    }

    const plan = await createPlan({ name });
    router.replace({ pathname: "/(tabs)/Workouts/plan", params: { planId: plan.id } });
  }

  return { planName, setPlanName, handleSave, createPlan, saving, error };
}
