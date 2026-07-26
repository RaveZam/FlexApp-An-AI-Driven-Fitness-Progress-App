import "@/global.css";
import { usePalette } from "@/src/theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCreatePlan } from "../hooks/useCreatePlan";

export default function CreatePlanScreen() {
  const p = usePalette();
  const router = useRouter();
  const { planName, setPlanName, handleSave, saving } = useCreatePlan();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: p.ink }} edges={["top"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Header */}
        <Animated.View
          entering={FadeInDown.delay(50).duration(350)}
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 20,
            paddingTop: 8,
            paddingBottom: 16,
          }}
        >
          <View style={{ flex: 1 }}>
            <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7} hitSlop={8}>
              <Ionicons name="chevron-back" size={24} color={p.muted} />
            </TouchableOpacity>
          </View>

          <View style={{ flex: 1, alignItems: "center" }}>
            <Text
              style={{
                color: p.bone,
                fontSize: 18,
                fontFamily: "Inter_600SemiBold",
                letterSpacing: -0.3,
              }}
            >
              New Plan
            </Text>
          </View>

          <View style={{ flex: 1, alignItems: "flex-end" }}>
            <TouchableOpacity
              onPress={handleSave}
              disabled={saving}
              activeOpacity={0.7}
              style={{
                paddingHorizontal: 14,
                paddingVertical: 8,
                borderRadius: 10,
                backgroundColor: p.accentSoft,
                borderWidth: 1,
                borderColor: p.accentBorderSoft,
              }}
            >
              <Text
                style={{
                  color: saving ? p.mutedSoft : p.accent,
                  fontSize: 13,
                  fontFamily: "Inter_600SemiBold",
                }}
              >
                {saving ? "Saving…" : "Create"}
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        <View style={{ paddingHorizontal: 20, paddingTop: 8 }}>
          <Animated.View entering={FadeInDown.delay(100).duration(350)}>
            <Text
              style={{
                color: p.muted,
                fontSize: 11,
                fontFamily: "Inter_500Medium",
                letterSpacing: 0.8,
                textTransform: "uppercase",
                marginBottom: 8,
              }}
            >
              Plan Name
            </Text>
            <TextInput
              value={planName}
              onChangeText={setPlanName}
              placeholder="e.g. PPL, Upper / Lower, 5-Day Split"
              placeholderTextColor={p.mutedSoft}
              autoFocus
              returnKeyType="done"
              onSubmitEditing={handleSave}
              style={{
                backgroundColor: p.inkRaised,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: p.hairline,
                color: p.bone,
                fontFamily: "Inter_500Medium",
                fontSize: 16,
                padding: 14,
              }}
            />
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(180).duration(350)} style={{ marginTop: 20 }}>
            <Text
              style={{
                color: p.mutedSoft,
                fontSize: 12,
                fontFamily: "Inter_400Regular",
                lineHeight: 18,
              }}
            >
              {"A plan groups your per-day workouts. After creating the plan, add individual days (Push, Pull, Legs, etc.) and assign them to days of the week."}
            </Text>
          </Animated.View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
