import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInRight } from "react-native-reanimated";
import type { WorkoutPlan } from "../../types";

type Props = { plan: WorkoutPlan; index: number; onPress: () => void };

export function PlanCard({ plan, index, onPress }: Props) {
  return (
    <Animated.View entering={FadeInRight.delay(200 + index * 100).duration(400)}>
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
                {plan.name}
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                <Ionicons name="calendar-outline" size={11} color="#444" />
                <Text
                  style={{
                    color: "#444",
                    fontSize: 11,
                    fontFamily: "Inter_400Regular",
                    letterSpacing: 0.2,
                  }}
                >
                  {plan.workouts.length} day{plan.workouts.length !== 1 ? "s" : ""}
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
