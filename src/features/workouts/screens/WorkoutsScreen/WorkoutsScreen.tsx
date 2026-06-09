import "@/global.css";
import { FontFamilies, Palette } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { PlanCard } from "../../components/plans/PlanCard";
import { usePlans } from "../../hooks/usePlans";

export default function WorkoutsScreen() {
  const router = useRouter();
  const { plans, loading } = usePlans();

  const goToCreate = () => router.push("/(tabs)/Workouts/create-plan");

  const ctaScale = useSharedValue(1);
  const ctaStyle = useAnimatedStyle(() => ({
    transform: [{ scale: ctaScale.value }],
  }));

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      {/* Atmospheric top glow — cohesive with Home */}
      <LinearGradient
        colors={["rgba(52,211,153,0.08)", "transparent"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 0.32 }}
        style={StyleSheet.absoluteFillObject}
        pointerEvents="none"
      />

      <View style={styles.container}>
        {/* Editorial masthead */}
        <Animated.View
          entering={FadeInDown.delay(40).duration(420)}
          style={styles.masthead}
        >
          <Text style={styles.eyebrow}>Training Library</Text>
          <Text style={styles.title}>Workouts</Text>

          <View style={styles.statRow}>
            <Text style={styles.statNumber}>
              {String(plans.length).padStart(2, "0")}
            </Text>
            <Text style={styles.statLabel}>
              active{"\n"}
              {plans.length === 1 ? "plan" : "plans"}
            </Text>
          </View>
        </Animated.View>

        <View style={styles.hairline} />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {loading && plans.length === 0 ? (
            <View style={styles.center}>
              <ActivityIndicator color={Palette.accent} />
            </View>
          ) : plans.length === 0 ? (
            <Animated.View
              entering={FadeInDown.delay(140).duration(420)}
              style={styles.empty}
            >
              <View style={styles.emptyGlyph}>
                <Ionicons name="barbell-outline" size={26} color={Palette.muted} />
              </View>
              <Text style={styles.emptyTitle}>No plans yet</Text>
              <Text style={styles.emptyBody}>
                Build your first training plan{"\n"}to start tracking sessions.
              </Text>
            </Animated.View>
          ) : (
            <View style={styles.list}>
              {plans.map((plan, index) => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  index={index}
                  onPress={() =>
                    router.push({
                      pathname: "/(tabs)/Workouts/plan",
                      params: { planId: plan.id },
                    })
                  }
                />
              ))}
            </View>
          )}
        </ScrollView>

        {/* Primary action */}
        <Animated.View
          entering={FadeIn.delay(360).duration(420)}
          style={[styles.ctaWrap, ctaStyle]}
        >
          <Pressable
            onPressIn={() => (ctaScale.value = withTiming(0.97, { duration: 120 }))}
            onPressOut={() => (ctaScale.value = withTiming(1, { duration: 160 }))}
            onPress={goToCreate}
            style={styles.cta}
          >
            <Text style={styles.ctaText}>Create Plan</Text>
            <View style={styles.ctaGlyph}>
              <Ionicons name="add" size={15} color={Palette.accent} />
            </View>
          </Pressable>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Palette.ink },
  container: { flex: 1, backgroundColor: "transparent" },

  masthead: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 18,
  },
  eyebrow: {
    color: Palette.accent,
    fontSize: 10,
    fontFamily: FontFamilies.medium,
    letterSpacing: 3,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  title: {
    color: Palette.bone,
    fontSize: 40,
    fontFamily: FontFamilies.displayLight,
    letterSpacing: -1,
    lineHeight: 42,
  },
  statRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
    marginTop: 16,
  },
  statNumber: {
    color: Palette.bone,
    fontSize: 30,
    fontFamily: FontFamilies.displayMedium,
    letterSpacing: -1,
    lineHeight: 30,
  },
  statLabel: {
    color: Palette.muted,
    fontSize: 11,
    fontFamily: FontFamilies.regular,
    letterSpacing: 1.4,
    textTransform: "uppercase",
    lineHeight: 14,
    paddingBottom: 1,
  },

  hairline: {
    marginHorizontal: 20,
    height: StyleSheet.hairlineWidth,
    backgroundColor: Palette.hairlineStrong,
  },

  scrollContent: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 24 },
  list: { gap: 12 },

  center: { paddingTop: 60, alignItems: "center" },

  empty: { paddingTop: 70, alignItems: "center" },
  emptyGlyph: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Palette.hairlineStrong,
    backgroundColor: Palette.inkRaised,
    marginBottom: 18,
  },
  emptyTitle: {
    color: Palette.bone,
    fontSize: 18,
    fontFamily: FontFamilies.displayMedium,
    letterSpacing: -0.3,
    marginBottom: 7,
  },
  emptyBody: {
    color: Palette.muted,
    fontSize: 13,
    fontFamily: FontFamilies.regular,
    textAlign: "center",
    lineHeight: 19,
  },

  ctaWrap: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 14 },
  cta: {
    height: 56,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
    backgroundColor: Palette.inkRaised,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Palette.accentBorder,
  },
  ctaText: {
    color: Palette.bone,
    fontSize: 12,
    fontFamily: FontFamilies.displayMedium,
    letterSpacing: 2.4,
    textTransform: "uppercase",
  },
  ctaGlyph: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Palette.accentBorder,
    alignItems: "center",
    justifyContent: "center",
  },
});
