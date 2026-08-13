import "@/global.css";
import { usePalette, type Palette } from "@/src/theme";
import { LinearGradient } from "expo-linear-gradient";
import { useMemo } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { PlanDetailMasthead } from "../components/PlanDetailMasthead";
import { PlanDetailNav } from "../components/PlanDetailNav";
import { EmptyState } from "../../components/EmptyState";
import { PlanWorkoutCard } from "../components/PlanWorkoutCard";
import { usePlanDetailScreen } from "../hooks/usePlanDetailScreen";

export default function PlanDetailScreen() {
  const p = usePalette();
  const styles = useMemo(() => makeStyles(p), [p]);
  const { planId, plan, isActive, toggleActive, openWorkout } =
    usePlanDetailScreen();

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <LinearGradient
        colors={[p.accentSoft, "transparent"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 0.32 }}
        style={StyleSheet.absoluteFillObject}
        pointerEvents="none"
      />

      <View style={styles.container}>
        <PlanDetailNav planId={planId} canAddWorkout={!!plan} />

        {!plan ? (
          <View style={styles.notFound}>
            <EmptyState title="Plan not found" />
          </View>
        ) : (
          <>
            <PlanDetailMasthead
              plan={plan}
              isActive={isActive}
              onToggleActive={toggleActive}
            />

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
                  <EmptyState
                    title="No workouts yet"
                    body={`Add your first training day\nto build out this plan.`}
                  />
                </Animated.View>
              ) : (
                <View style={styles.list}>
                  {plan.workouts.map((workout, index) => (
                    <PlanWorkoutCard
                      key={workout.id}
                      workout={workout}
                      index={index}
                      onPress={() => openWorkout(workout.id)}
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

const makeStyles = (p: Palette) =>
  StyleSheet.create({
    safe: { flex: 1, backgroundColor: p.ink },
    container: { flex: 1, backgroundColor: "transparent" },

    hairline: {
      marginHorizontal: 20,
      height: StyleSheet.hairlineWidth,
      backgroundColor: p.hairlineStrong,
    },

    scrollContent: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 32 },
    list: { gap: 12 },

    notFound: { flex: 1, alignItems: "center", justifyContent: "center" },
    empty: { paddingTop: 60, alignItems: "center" },
  });
