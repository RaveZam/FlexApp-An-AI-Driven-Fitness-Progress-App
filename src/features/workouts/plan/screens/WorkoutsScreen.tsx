import "@/global.css";
import { usePalette, type Palette } from "@/src/theme";
import { LinearGradient } from "expo-linear-gradient";
import { useMemo } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { CreatePlanButton } from "../components/CreatePlanButton";
import { PlanCard } from "../components/PlanCard";
import { EmptyState } from "../../components/EmptyState";
import { WorkoutsMasthead } from "../components/WorkoutsMasthead";
import { useWorkoutsScreen } from "../hooks/useWorkoutsScreen";

export default function WorkoutsScreen() {
  const p = usePalette();
  const styles = useMemo(() => makeStyles(p), [p]);
  const { plans, loading, openPlan } = useWorkoutsScreen();

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      {/* Atmospheric top glow — cohesive with Home */}
      <LinearGradient
        colors={[p.accentSoft, "transparent"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 0.32 }}
        style={StyleSheet.absoluteFillObject}
        pointerEvents="none"
      />

      <View style={styles.container}>
        <WorkoutsMasthead planCount={plans.length} />

        <View style={styles.hairline} />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {loading && plans.length === 0 ? (
            <View style={styles.center}>
              <ActivityIndicator color={p.accent} />
            </View>
          ) : plans.length === 0 ? (
            <Animated.View
              entering={FadeInDown.delay(140).duration(420)}
              style={styles.empty}
            >
              <EmptyState
                title="No plans yet"
                body={`Build your first training plan\nto start tracking sessions.`}
              />
            </Animated.View>
          ) : (
            <View style={styles.list}>
              {plans.map((plan, index) => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  index={index}
                  onPress={() => openPlan(plan.id)}
                />
              ))}
            </View>
          )}
        </ScrollView>

        <CreatePlanButton />
      </View>
    </SafeAreaView>
  );
}

const makeStyles = (p: Palette) =>
  StyleSheet.create({
    safe: { flex: 1, backgroundColor: p.ink },
    container: { flex: 1, backgroundColor: "transparent" },

    hairline: {
      marginHorizontal: 20,
      height: StyleSheet.hairlineWidth,
      backgroundColor: p.hairlineStrong,
    },

    scrollContent: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 24 },
    list: { gap: 12 },

    center: { paddingTop: 60, alignItems: "center" },
    empty: { paddingTop: 70, alignItems: "center" },
  });
