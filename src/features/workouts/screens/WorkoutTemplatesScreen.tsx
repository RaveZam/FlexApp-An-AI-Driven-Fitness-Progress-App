import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import {
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  FadeInDown,
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
    days: 6,
    accent: "#10b981",
    accentBg: "#1a472a",
    icon: "fitness",
    muscles: "Chest, Back, Legs",
  },
  {
    id: "upper-lower",
    name: "Upper / Lower",
    days: 4,
    accent: "#3b82f6",
    accentBg: "#1e3a5f",
    icon: "body",
    muscles: "Upper & Lower Body",
  },
  {
    id: "bro-split",
    name: "Bro Split",
    days: 5,
    accent: "#f59e0b",
    accentBg: "#5c3d0e",
    icon: "barbell",
    muscles: "One muscle per day",
  },
  {
    id: "full-body",
    name: "Full Body",
    days: 3,
    accent: "#ef4444",
    accentBg: "#5c1a1a",
    icon: "flame",
    muscles: "All major groups",
  },
  {
    id: "arnold",
    name: "Arnold Split",
    days: 6,
    accent: "#a855f7",
    accentBg: "#3b1f5c",
    icon: "trophy",
    muscles: "Chest/Back, Shoulders/Arms, Legs",
  },
  {
    id: "phul",
    name: "PHUL",
    days: 4,
    accent: "#06b6d4",
    accentBg: "#0e3d4a",
    icon: "flash",
    muscles: "Power + Hypertrophy",
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
            {/* Icon + days badge */}
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

export default function WorkoutTemplatesScreen() {
  const router = useRouter();
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
              gap: 12,
            },
            headerStyle,
          ]}
        >
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.back()}
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              backgroundColor: "#191919",
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.06)",
            }}
          >
            <Ionicons name="chevron-back" size={20} color="#ffffff" />
          </TouchableOpacity>

          <View>
            <Text
              style={{
                color: "#ffffff",
                fontSize: 22,
                fontFamily: "Inter_700Bold",
                letterSpacing: -0.5,
              }}
            >
              Workout Templates
            </Text>
            <Text
              style={{
                color: "#555",
                fontSize: 13,
                fontFamily: "Inter_400Regular",
                marginTop: 2,
              }}
            >
              Pick a split to get started
            </Text>
          </View>
        </Animated.View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 32 }}
        >
          {/* Template grid */}
          <View style={{ paddingHorizontal: 20 }}>
            <Animated.View
              entering={FadeInDown.delay(60).duration(400)}
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
            </Animated.View>
          </View>

          {/* ── Divider ── */}
          <View
            style={{
              marginHorizontal: 20,
              marginVertical: 24,
              height: 1,
              backgroundColor: "rgba(255,255,255,0.04)",
            }}
          />

          {/* Create Custom Workout CTA */}
          <View style={{ paddingHorizontal: 20 }}>
            <Animated.View
              entering={FadeInDown.delay(700).springify().damping(18)}
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
