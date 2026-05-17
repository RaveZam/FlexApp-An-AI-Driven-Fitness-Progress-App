import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  FadeInDown,
  FadeInRight,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { useWorkouts } from "../hooks/useWorkouts";
import type { Workout } from "../types";
import "@/global.css";

function WorkoutCard({ workout, index }: { workout: Workout; index: number }) {
  return (
    <Animated.View
      entering={FadeInRight.delay(200 + index * 100)
        .springify()
        .damping(18)}
    >
      <TouchableOpacity activeOpacity={0.7}>
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

          <View
            style={{
              flex: 1,
              padding: 16,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  color: "#ffffff",
                  fontSize: 14,
                  fontFamily: "Inter_500Medium",
                  marginBottom: 5,
                  letterSpacing: 0.1,
                }}
              >
                {workout.name}
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                <Ionicons name="barbell-outline" size={11} color="#444" />
                <Text
                  style={{
                    color: "#444",
                    fontSize: 11,
                    fontFamily: "Inter_400Regular",
                    letterSpacing: 0.2,
                  }}
                >
                  {workout.exercises.length} exercise{workout.exercises.length !== 1 ? "s" : ""}
                </Text>
              </View>
            </View>

            <Ionicons name="chevron-forward" size={18} color="#333" />
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function WorkoutsScreen() {
  const router = useRouter();
  const { workouts, loading } = useWorkouts();

  const headerOpacity = useSharedValue(0);
  const headerTranslateY = useSharedValue(-10);

  useEffect(() => {
    headerOpacity.value = withDelay(50, withTiming(1, { duration: 400 }));
    headerTranslateY.value = withDelay(
      50,
      withSpring(0, { damping: 20, stiffness: 200 })
    );
  }, []);

  const headerStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [{ translateY: headerTranslateY.value }],
  }));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0f0f0f" }} edges={["top"]}>
      <View style={{ flex: 1, backgroundColor: "#0f0f0f" }}>
        {/* Header */}
        <Animated.View
          style={[
            {
              paddingHorizontal: 20,
              paddingTop: 8,
              paddingBottom: 16,
              flexDirection: "row",
              alignItems: "center",
            },
            headerStyle,
          ]}
        >
          <View style={{ flex: 1 }} />

          <View style={{ flex: 1, alignItems: "center" }}>
            <Text
              style={{
                color: "#ffffff",
                fontSize: 18,
                fontFamily: "Inter_600SemiBold",
                letterSpacing: -0.3,
              }}
            >
              Workouts
            </Text>
          </View>

          <View style={{ flex: 1, alignItems: "flex-end" }}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.push("/(tabs)/Workouts/create")}
              style={{
                width: 42,
                height: 42,
                borderRadius: 12,
                backgroundColor: "#1a472a",
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 1,
                borderColor: "rgba(16, 185, 129, 0.15)",
              }}
            >
              <Ionicons name="add" size={24} color="#10b981" />
            </TouchableOpacity>
          </View>
        </Animated.View>

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
                  style={{
                    width: 4,
                    height: 18,
                    borderRadius: 2,
                    backgroundColor: "#10b981",
                  }}
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
                  Your Workouts
                </Text>
              </View>
              {workouts.length > 0 && (
                <Text
                  style={{
                    color: "#444",
                    fontSize: 11,
                    fontFamily: "Inter_400Regular",
                  }}
                >
                  {workouts.length} total
                </Text>
              )}
            </Animated.View>

            {loading && workouts.length === 0 ? (
              <View style={{ paddingTop: 40, alignItems: "center" }}>
                <ActivityIndicator color="#10b981" />
              </View>
            ) : workouts.length === 0 ? (
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
                  No workouts yet.{"\n"}Tap + to create your first one.
                </Text>
              </Animated.View>
            ) : (
              <View style={{ gap: 10 }}>
                {workouts.map((workout, index) => (
                  <WorkoutCard key={workout.id} workout={workout} index={index} />
                ))}
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
