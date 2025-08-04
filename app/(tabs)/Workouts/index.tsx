import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import Button from "@/components/ui/Button";
import WorkoutPlanCard from "@/components/Workout/WorkoutPlanCard";
import { useFetchWorkoutPlans } from "@/hooks/useFetchWorkoutPlans";
import { useRouter } from "expo-router";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function index() {
  const router = useRouter();
  const { workoutPlans, loading } = useFetchWorkoutPlans();

  if (loading) {
    return (
      <SafeAreaView className="flex-1">
        <ThemedView className="flex-1 justify-center">
          <ActivityIndicator size="large" color="#0000ff" />
        </ThemedView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1">
      <ThemedView className="flex-1">
        <View className="m-4 mt-12 flex-1">
          <ThemedText className="text-2xl font-medium text-center mb-4">
            Your Workout Plans
          </ThemedText>

          {workoutPlans && workoutPlans.length > 0 ? (
            <ScrollView
              showsVerticalScrollIndicator={false}
              alwaysBounceVertical={true}
              className="flex-1 mx-4"
            >
              {workoutPlans.map((plan: any, index) => (
                <>
                  {plan.is_active && (
                    <Text
                      key={index}
                      className="text-emerald-600 font-medium text-center"
                    >
                      Currently Active Plan:
                    </Text>
                  )}
                  <WorkoutPlanCard
                    key={plan.id}
                    plan={plan}
                    onPress={() => {
                      router.push({
                        pathname: "/Workouts/PlanDetails" as never,
                        params: { planId: plan.id, planName: plan.name },
                      });
                    }}
                  />
                </>
              ))}
            </ScrollView>
          ) : (
            <View className="flex-1 justify-center items-center">
              <ThemedText className="text-center text-lg font-medium opacity-60 mb-4">
                You Have No Workout Plans...
              </ThemedText>
              <ThemedText className="text-center text-sm opacity-50">
                Create your first workout plan to get started!
              </ThemedText>
            </View>
          )}
        </View>

        <View className="p-4">
          <Button
            className=""
            buttonText="Create Workout"
            onPress={() => router.push("/Workouts/CreatePlanScreen" as never)}
          />
        </View>
      </ThemedView>
    </SafeAreaView>
  );
}
