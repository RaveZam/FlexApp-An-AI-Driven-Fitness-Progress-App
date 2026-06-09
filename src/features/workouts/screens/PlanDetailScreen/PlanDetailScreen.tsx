import "@/global.css";
import { FontFamilies, Palette } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { DAY_LABELS } from "../../dayLabels";
import { useActivePlan } from "../../hooks/useActivePlan";
import { usePlans } from "../../hooks/usePlans";
import type { Workout } from "../../types";

function DayChips({ days }: { days: number[] }) {
  if (days.length === 0) return null;
  return (
    <View style={styles.dayRow}>
      {DAY_LABELS.map((label, i) => {
        const on = days.includes(i);
        return (
          <View key={i} style={[styles.dayChip, on && styles.dayChipOn]}>
            <Text style={[styles.dayText, on && styles.dayTextOn]}>{label}</Text>
          </View>
        );
      })}
    </View>
  );
}

function WorkoutCard({
  workout,
  index,
  onPress,
}: {
  workout: Workout;
  index: number;
  onPress: () => void;
}) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View entering={FadeInDown.delay(160 + index * 70).duration(420)}>
      <Pressable
        onPressIn={() => (scale.value = withTiming(0.97, { duration: 120 }))}
        onPressOut={() => (scale.value = withTiming(1, { duration: 160 }))}
        onPress={onPress}
      >
        <Animated.View style={[styles.card, animatedStyle]}>
          <LinearGradient
            colors={[Palette.accent, Palette.accentDeep]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.rail}
          />

          <Text style={styles.ghostIndex}>
            {String(index + 1).padStart(2, "0")}
          </Text>

          <View style={styles.cardBody}>
            <View style={styles.cardHead}>
              <Text style={styles.cardEyebrow}>
                Day {String(index + 1).padStart(2, "0")}
              </Text>
              <Ionicons name="arrow-forward" size={14} color={Palette.accent} />
            </View>

            <Text style={styles.cardName} numberOfLines={1}>
              {workout.name}
            </Text>

            <View style={styles.metaItem}>
              <Ionicons name="barbell-outline" size={12} color={Palette.muted} />
              <Text style={styles.metaText}>
                {workout.exercises.length} exercise
                {workout.exercises.length !== 1 ? "s" : ""}
              </Text>
            </View>

            <DayChips days={workout.daysOfWeek} />
          </View>
        </Animated.View>
      </Pressable>
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

  const dayCount = plan?.workouts.length ?? 0;
  const exerciseCount =
    plan?.workouts.reduce((sum, w) => sum + w.exercises.length, 0) ?? 0;

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <LinearGradient
        colors={["rgba(52,211,153,0.08)", "transparent"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 0.32 }}
        style={StyleSheet.absoluteFillObject}
        pointerEvents="none"
      />

      <View style={styles.container}>
        {/* Nav row */}
        <View style={styles.navRow}>
          <Pressable onPress={() => router.back()} style={styles.iconButton}>
            <Ionicons name="chevron-back" size={20} color={Palette.bone} />
          </Pressable>

          {plan && (
            <Pressable
              onPress={() =>
                router.push({
                  pathname: "/(tabs)/Workouts/create",
                  params: { planId: planId ?? "" },
                })
              }
              style={styles.iconButton}
            >
              <Ionicons name="add" size={22} color={Palette.accent} />
            </Pressable>
          )}
        </View>

        {!plan ? (
          <View style={styles.notFound}>
            <View style={styles.emptyGlyph}>
              <Ionicons name="barbell-outline" size={26} color={Palette.muted} />
            </View>
            <Text style={styles.emptyTitle}>Plan not found</Text>
          </View>
        ) : (
          <>
            {/* Editorial masthead */}
            <Animated.View
              entering={FadeInDown.delay(40).duration(420)}
              style={styles.masthead}
            >
              <Text style={styles.eyebrow}>Training Plan</Text>
              <Text style={styles.title}>{plan.name}</Text>

              <View style={styles.statRow}>
                <View style={styles.metaItem}>
                  <Ionicons name="calendar-outline" size={13} color={Palette.muted} />
                  <Text style={styles.statText}>
                    {dayCount} day{dayCount !== 1 ? "s" : ""}
                  </Text>
                </View>
                <View style={styles.metaDot} />
                <View style={styles.metaItem}>
                  <Ionicons name="barbell-outline" size={13} color={Palette.muted} />
                  <Text style={styles.statText}>
                    {exerciseCount} exercise{exerciseCount !== 1 ? "s" : ""}
                  </Text>
                </View>
              </View>

              <Pressable
                onPress={() => setActivePlan(isActive ? null : (planId ?? null))}
                style={[styles.activeToggle, isActive && styles.activeToggleOn]}
              >
                {isActive && (
                  <Ionicons name="checkmark-circle" size={14} color={Palette.accent} />
                )}
                <Text
                  style={[styles.activeText, isActive && styles.activeTextOn]}
                >
                  {isActive ? "Active Plan" : "Set as Active"}
                </Text>
              </Pressable>
            </Animated.View>

            <View style={styles.hairline} />

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
            >
              {plan.workouts.length === 0 ? (
                <Animated.View
                  entering={FadeInDown.delay(140).duration(420)}
                  style={styles.empty}
                >
                  <View style={styles.emptyGlyph}>
                    <Ionicons name="barbell-outline" size={26} color={Palette.muted} />
                  </View>
                  <Text style={styles.emptyTitle}>No workouts yet</Text>
                  <Text style={styles.emptyBody}>
                    Add your first training day{"\n"}to build out this plan.
                  </Text>
                </Animated.View>
              ) : (
                <View style={styles.list}>
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
            </ScrollView>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Palette.ink },
  container: { flex: 1, backgroundColor: "transparent" },

  navRow: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: Palette.inkRaised,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Palette.hairlineStrong,
  },

  masthead: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 18 },
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
    fontSize: 34,
    fontFamily: FontFamilies.displayLight,
    letterSpacing: -0.8,
    lineHeight: 38,
  },
  statRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 14,
  },
  statText: {
    color: Palette.muted,
    fontSize: 12.5,
    fontFamily: FontFamilies.regular,
    letterSpacing: 0.2,
  },

  activeToggle: {
    alignSelf: "flex-start",
    marginTop: 16,
    height: 36,
    paddingHorizontal: 14,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: Palette.inkRaised,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Palette.hairlineStrong,
  },
  activeToggleOn: {
    backgroundColor: Palette.accentSoft,
    borderColor: Palette.accentBorder,
  },
  activeText: {
    color: Palette.muted,
    fontSize: 11,
    fontFamily: FontFamilies.medium,
    letterSpacing: 1.6,
    textTransform: "uppercase",
  },
  activeTextOn: { color: Palette.accent },

  hairline: {
    marginHorizontal: 20,
    height: StyleSheet.hairlineWidth,
    backgroundColor: Palette.hairlineStrong,
  },

  scrollContent: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 32 },
  list: { gap: 12 },

  // Workout card
  card: {
    backgroundColor: Palette.inkRaised,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Palette.hairline,
    flexDirection: "row",
  },
  rail: { width: 3, alignSelf: "stretch" },
  ghostIndex: {
    position: "absolute",
    right: 8,
    bottom: -14,
    color: Palette.bone,
    opacity: 0.03,
    fontSize: 76,
    fontFamily: FontFamilies.displaySemibold,
    letterSpacing: -2,
  },
  cardBody: { flex: 1, paddingVertical: 16, paddingLeft: 16, paddingRight: 16 },
  cardHead: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  cardEyebrow: {
    color: Palette.accent,
    fontSize: 9,
    fontFamily: FontFamilies.medium,
    letterSpacing: 2.4,
    textTransform: "uppercase",
  },
  cardName: {
    color: Palette.bone,
    fontSize: 18,
    fontFamily: FontFamilies.displayMedium,
    letterSpacing: -0.4,
    marginBottom: 9,
  },
  metaItem: { flexDirection: "row", alignItems: "center", gap: 5 },
  metaText: {
    color: Palette.muted,
    fontSize: 11.5,
    fontFamily: FontFamilies.regular,
    letterSpacing: 0.2,
  },
  metaDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: Palette.mutedSoft,
  },

  // Day chips
  dayRow: { flexDirection: "row", gap: 5, marginTop: 12 },
  dayChip: {
    width: 22,
    height: 22,
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Palette.hairline,
  },
  dayChipOn: {
    backgroundColor: Palette.accentSoft,
    borderColor: Palette.accentBorder,
  },
  dayText: {
    color: Palette.mutedSoft,
    fontSize: 9,
    fontFamily: FontFamilies.semibold,
  },
  dayTextOn: { color: Palette.accent },

  // Empty / not found
  notFound: { flex: 1, alignItems: "center", justifyContent: "center" },
  empty: { paddingTop: 60, alignItems: "center" },
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
});
