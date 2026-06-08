import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown, FadeInRight } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { useActivePlan } from "../hooks/useActivePlan";
import { usePlans } from "../hooks/usePlans";
import type { Workout } from "../types";
import "@/global.css";

const DAY_LABELS = ["S", "M", "T", "W", "Th", "F", "S"];

function DayChips({ days }: { days: number[] }) {
  if (days.length === 0) return null;
  return (
    <View style={{ flexDirection: "row", gap: 4, marginTop: 6 }}>
      {DAY_LABELS.map((label, i) => (
        <View
          key={i}
          style={{
            width: 20,
            height: 20,
            borderRadius: 10,
            backgroundColor: days.includes(i) ? "rgba(16,185,129,0.2)" : "transparent",
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 1,
            borderColor: days.includes(i) ? "rgba(16,185,129,0.5)" : "rgba(255,255,255,0.06)",
          }}
        >
          <Text
            style={{
              color: days.includes(i) ? "#10b981" : "#444",
              fontSize: 9,
              fontFamily: "Inter_600SemiBold",
            }}
          >
            {label}
          </Text>
        </View>
      ))}
    </View>
  );
}

function WorkoutCard({ workout, index, onPress }: { workout: Workout; index: number; onPress: () => void }) {
  return (
    <Animated.View entering={FadeInRight.delay(200 + index * 80).duration(400)}>
      <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
        <View
          style={{
            backgroundColor: "#191919",
            borderRadius: 14,
            overflow: "hidden",
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.04)",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: 3,
              alignSelf: "stretch",
              backgroundColor: "#10b981",
              opacity: 0.7,
            }}
          />
          <View style={{ flex: 1, padding: 16 }}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <Text
                style={{
                  color: "#ffffff",
                  fontSize: 14,
                  fontFamily: "Inter_500Medium",
                  letterSpacing: 0.1,
                }}
              >
                {workout.name}
              </Text>
              <Ionicons name="chevron-forward" size={18} color="#333" />
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 4 }}>
              <Ionicons name="barbell-outline" size={11} color="#444" />
              <Text style={{ color: "#444", fontSize: 11, fontFamily: "Inter_400Regular" }}>
                {workout.exercises.length} exercise{workout.exercises.length !== 1 ? "s" : ""}
              </Text>
            </View>
            <DayChips days={workout.daysOfWeek} />
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function PlanDetailScreen() {
  const router = useRouter();
  const { planId } = useLocalSearchParams<{ planId: string }>();
  const { plans } = usePlans();
  const { activePlanId, setActivePlan } = useActivePlan();

  const plan = plans.find((p) => p.id === planId);
  const isActive = activePlanId === planId;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0f0f0f" }} edges={["top"]}>
      <View style={{ flex: 1, backgroundColor: "#0f0f0f" }}>
        {/* Header */}
        <View
          style={{
            paddingHorizontal: 20,
            paddingTop: 8,
            paddingBottom: 16,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            activeOpacity={0.7}
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              backgroundColor: "#191919",
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.06)",
            }}
          >
            <Ionicons name="chevron-back" size={20} color="#aaa" />
          </TouchableOpacity>

          <View style={{ flex: 1, alignItems: "center" }}>
            <Text
              style={{
                color: "#ffffff",
                fontSize: 18,
                fontFamily: "Inter_600SemiBold",
                letterSpacing: -0.3,
              }}
              numberOfLines={1}
            >
              {plan?.name ?? "Plan"}
            </Text>
          </View>

          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setActivePlan(isActive ? null : (planId ?? null))}
              style={{
                height: 30,
                paddingHorizontal: 10,
                borderRadius: 8,
                backgroundColor: isActive ? "rgba(16,185,129,0.15)" : "#191919",
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 1,
                borderColor: isActive ? "rgba(16,185,129,0.4)" : "rgba(255,255,255,0.06)",
                flexDirection: "row",
                gap: 4,
              }}
            >
              {isActive && <Ionicons name="checkmark-circle" size={13} color="#10b981" />}
              <Text
                style={{
                  color: isActive ? "#10b981" : "#666",
                  fontSize: 11,
                  fontFamily: "Inter_600SemiBold",
                }}
              >
                {isActive ? "Active" : "Set Active"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() =>
                router.push({ pathname: "/(tabs)/Workouts/create", params: { planId: planId ?? "" } })
              }
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                backgroundColor: "#1a472a",
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 1,
                borderColor: "rgba(16,185,129,0.15)",
              }}
            >
              <Ionicons name="add" size={22} color="#10b981" />
            </TouchableOpacity>
          </View>
        </View>

        {!plan ? (
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 8 }}>
            <Ionicons name="barbell-outline" size={32} color="#333" />
            <Text style={{ color: "#444", fontSize: 13, fontFamily: "Inter_400Regular" }}>
              Plan not found.
            </Text>
          </View>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 32 }}
          >
            <View style={{ paddingHorizontal: 20 }}>
              <Animated.View
                entering={FadeInDown.delay(60).duration(400)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 14,
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <View
                    style={{ width: 4, height: 18, borderRadius: 2, backgroundColor: "#10b981" }}
                  />
                  <Text
                    style={{
                      color: "#ffffff",
                      fontSize: 13,
                      fontFamily: "Inter_500Medium",
                      letterSpacing: 0.8,
                      textTransform: "uppercase",
                    }}
                  >
                    Workouts
                  </Text>
                </View>
                {plan.workouts.length > 0 && (
                  <Text style={{ color: "#444", fontSize: 11, fontFamily: "Inter_400Regular" }}>
                    {plan.workouts.length} day{plan.workouts.length !== 1 ? "s" : ""}
                  </Text>
                )}
              </Animated.View>

              {plan.workouts.length === 0 ? (
                <Animated.View
                  entering={FadeInDown.delay(120).duration(400)}
                  style={{ paddingTop: 40, alignItems: "center", gap: 8 }}
                >
                  <Ionicons name="barbell-outline" size={32} color="#333" />
                  <Text
                    style={{
                      color: "#444",
                      fontSize: 13,
                      fontFamily: "Inter_400Regular",
                      textAlign: "center",
                    }}
                  >
                    No workouts yet.{"\n"}Tap + to add your first day.
                  </Text>
                </Animated.View>
              ) : (
                <View style={{ gap: 10 }}>
                  {plan.workouts.map((workout, index) => (
                    <WorkoutCard
                      key={workout.id}
                      workout={workout}
                      index={index}
                      onPress={() => router.push(`/(tabs)/Workouts/${workout.id}`)}
                    />
                  ))}
                </View>
              )}
            </View>
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}
