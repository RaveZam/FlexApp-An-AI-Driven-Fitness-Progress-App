import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useCallback, useEffect } from "react";
import {
  Dimensions,
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
import "@/global.css";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = (SCREEN_WIDTH - 48 - 12) / 2;

type TemplateSplit = {
  id: string;
  name: string;
  shortName: string;
  days: number;
  accent: string;
  accentBg: string;
  icon: keyof typeof Ionicons.glyphMap;
  muscles: string;
};

const TEMPLATE_SPLITS: TemplateSplit[] = [
  {
    id: "ppl",
    name: "Push Pull Legs",
    shortName: "PPL",
    days: 6,
    accent: "#10b981",
    accentBg: "#1a472a",
    icon: "fitness",
    muscles: "Chest, Back, Legs",
  },
  {
    id: "upper-lower",
    name: "Upper / Lower",
    shortName: "U/L",
    days: 4,
    accent: "#3b82f6",
    accentBg: "#1e3a5f",
    icon: "body",
    muscles: "Upper & Lower Body",
  },
  {
    id: "bro-split",
    name: "Bro Split",
    shortName: "BRO",
    days: 5,
    accent: "#f59e0b",
    accentBg: "#5c3d0e",
    icon: "barbell",
    muscles: "One muscle per day",
  },
  {
    id: "full-body",
    name: "Full Body",
    shortName: "FULL",
    days: 3,
    accent: "#ef4444",
    accentBg: "#5c1a1a",
    icon: "flame",
    muscles: "All major groups",
  },
  {
    id: "arnold",
    name: "Arnold Split",
    shortName: "ARNI",
    days: 6,
    accent: "#a855f7",
    accentBg: "#3b1f5c",
    icon: "trophy",
    muscles: "Chest/Back, Shoulders/Arms, Legs",
  },
  {
    id: "phul",
    name: "PHUL",
    shortName: "PHUL",
    days: 4,
    accent: "#06b6d4",
    accentBg: "#0e3d4a",
    icon: "flash",
    muscles: "Power + Hypertrophy",
  },
];

type UserWorkout = {
  id: string;
  name: string;
  lastPerformed: string;
  exerciseCount: number;
  accent: string;
};

const PLACEHOLDER_USER_WORKOUTS: UserWorkout[] = [
  {
    id: "1",
    name: "Monday Push Day",
    lastPerformed: "2 days ago",
    exerciseCount: 6,
    accent: "#10b981",
  },
  {
    id: "2",
    name: "Wednesday Legs",
    lastPerformed: "4 days ago",
    exerciseCount: 5,
    accent: "#3b82f6",
  },
  {
    id: "3",
    name: "Friday Pull Day",
    lastPerformed: "6 days ago",
    exerciseCount: 7,
    accent: "#f59e0b",
  },
];

function TemplateCard({
  template,
  index,
}: {
  template: TemplateSplit;
  index: number;
}) {
  return (
    <Animated.View
      entering={FadeInDown.delay(100 + index * 80)
        .springify()
        .damping(18)}
      style={{ width: CARD_WIDTH }}
    >
      <TouchableOpacity activeOpacity={0.7}>
        <View
          style={{
            backgroundColor: "#191919",
            borderRadius: 16,
            overflow: "hidden",
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.04)",
          }}
        >
          {/* Accent strip */}
          <View
            style={{
              height: 3,
              backgroundColor: template.accent,
              opacity: 0.8,
            }}
          />

          <View style={{ padding: 14 }}>
            {/* Icon + short name */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 10,
              }}
            >
              <View
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  backgroundColor: template.accentBg,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons
                  name={template.icon}
                  size={20}
                  color={template.accent}
                />
              </View>
              <View
                style={{
                  backgroundColor: template.accentBg,
                  paddingHorizontal: 8,
                  paddingVertical: 3,
                  borderRadius: 6,
                }}
              >
                <Text
                  style={{
                    color: template.accent,
                    fontSize: 10,
                    fontFamily: "Inter_700Bold",
                    letterSpacing: 1.2,
                  }}
                >
                  {template.days}x/WK
                </Text>
              </View>
            </View>

            {/* Name */}
            <Text
              style={{
                color: "#ffffff",
                fontSize: 14,
                fontFamily: "Inter_600SemiBold",
                marginBottom: 4,
              }}
              numberOfLines={1}
            >
              {template.name}
            </Text>

            {/* Muscle targets */}
            <Text
              style={{
                color: "#666",
                fontSize: 11,
                fontFamily: "Inter_400Regular",
              }}
              numberOfLines={1}
            >
              {template.muscles}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

function UserWorkoutCard({
  workout,
  index,
}: {
  workout: UserWorkout;
  index: number;
}) {
  return (
    <Animated.View
      entering={FadeInRight.delay(400 + index * 100)
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
          {/* Left accent bar */}
          <View
            style={{
              width: 3,
              alignSelf: "stretch",
              backgroundColor: workout.accent,
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
                  fontSize: 15,
                  fontFamily: "Inter_600SemiBold",
                  marginBottom: 4,
                }}
              >
                {workout.name}
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
                >
                  <Ionicons name="barbell-outline" size={12} color="#555" />
                  <Text
                    style={{
                      color: "#555",
                      fontSize: 12,
                      fontFamily: "Inter_400Regular",
                    }}
                  >
                    {workout.exerciseCount} exercises
                  </Text>
                </View>
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
                >
                  <Ionicons name="time-outline" size={12} color="#555" />
                  <Text
                    style={{
                      color: "#555",
                      fontSize: 12,
                      fontFamily: "Inter_400Regular",
                    }}
                  >
                    {workout.lastPerformed}
                  </Text>
                </View>
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
              justifyContent: "space-between",
            },
            headerStyle,
          ]}
        >
          <View>
            <Text
              style={{
                color: "#ffffff",
                fontSize: 26,
                fontFamily: "Inter_700Bold",
                letterSpacing: -0.5,
              }}
            >
              Workouts
            </Text>
            <Text
              style={{
                color: "#555",
                fontSize: 13,
                fontFamily: "Inter_400Regular",
                marginTop: 2,
              }}
            >
              Choose a template or build your own
            </Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.7}
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
        </Animated.View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 32 }}
        >
          {/* ── Workout Templates ── */}
          <View style={{ paddingHorizontal: 20, marginBottom: 8 }}>
            <Animated.View
              entering={FadeInDown.delay(60).duration(400)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 14,
              }}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
              >
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
                    fontSize: 16,
                    fontFamily: "Inter_600SemiBold",
                    letterSpacing: 0.3,
                  }}
                >
                  Workout Templates
                </Text>
              </View>
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <Text
                  style={{
                    color: "#10b981",
                    fontSize: 12,
                    fontFamily: "Inter_500Medium",
                  }}
                >
                  See all
                </Text>
                <Ionicons name="chevron-forward" size={14} color="#10b981" />
              </TouchableOpacity>
            </Animated.View>

            {/* Template grid */}
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                gap: 12,
              }}
            >
              {TEMPLATE_SPLITS.map((template, index) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  index={index}
                />
              ))}
            </View>
          </View>

          {/* ── Divider ── */}
          <View
            style={{
              marginHorizontal: 20,
              marginVertical: 20,
              height: 1,
              backgroundColor: "rgba(255,255,255,0.04)",
            }}
          />

          {/* ── Your Workouts ── */}
          <View style={{ paddingHorizontal: 20 }}>
            <Animated.View
              entering={FadeInDown.delay(350).duration(400)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 14,
              }}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
              >
                <View
                  style={{
                    width: 4,
                    height: 18,
                    borderRadius: 2,
                    backgroundColor: "#3b82f6",
                  }}
                />
                <Text
                  style={{
                    color: "#ffffff",
                    fontSize: 16,
                    fontFamily: "Inter_600SemiBold",
                    letterSpacing: 0.3,
                  }}
                >
                  Your Workouts
                </Text>
              </View>
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <Text
                  style={{
                    color: "#3b82f6",
                    fontSize: 12,
                    fontFamily: "Inter_500Medium",
                  }}
                >
                  Manage
                </Text>
                <Ionicons name="chevron-forward" size={14} color="#3b82f6" />
              </TouchableOpacity>
            </Animated.View>

            {/* User workout list */}
            <View style={{ gap: 10 }}>
              {PLACEHOLDER_USER_WORKOUTS.map((workout, index) => (
                <UserWorkoutCard
                  key={workout.id}
                  workout={workout}
                  index={index}
                />
              ))}
            </View>

            {/* Create custom workout CTA */}
            <Animated.View
              entering={FadeInDown.delay(700).springify().damping(18)}
              style={{ marginTop: 16 }}
            >
              <TouchableOpacity activeOpacity={0.7}>
                <View
                  style={{
                    borderRadius: 14,
                    overflow: "hidden",
                    borderWidth: 1,
                    borderColor: "rgba(16, 185, 129, 0.15)",
                    borderStyle: "dashed",
                  }}
                >
                  <View
                    style={{
                      padding: 18,
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 10,
                    }}
                  >
                    <View
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 8,
                        backgroundColor: "#1a472a",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Ionicons name="add" size={18} color="#10b981" />
                    </View>
                    <Text
                      style={{
                        color: "#10b981",
                        fontSize: 14,
                        fontFamily: "Inter_600SemiBold",
                      }}
                    >
                      Create Custom Workout
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
