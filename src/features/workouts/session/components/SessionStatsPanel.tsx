import { usePalette, type Palette } from "@/src/theme";
import { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { useWorkoutSession } from "../hooks/useWorkoutSession";
import Last7SessionsPanel from "./Last7SessionsPanel";
import PersonalRecordPanel from "./PersonalRecordPanel";

export default function SessionStatsPanel() {
  const p = usePalette();
  const styles = useMemo(() => makeStyles(p), [p]);
  const { activeExerciseId } = useWorkoutSession();

  if (!activeExerciseId) {
    return null;
  }

  return (
    <Animated.View
      entering={FadeInDown.delay(180).duration(500)}
      style={styles.statsPanel}
    >
      <PersonalRecordPanel />
      <View style={styles.statsDivider} />
      <Last7SessionsPanel />
    </Animated.View>
  );
}

const makeStyles = (p: Palette) =>
  StyleSheet.create({
    statsPanel: {
      flexDirection: "row",
      marginHorizontal: 20,
      marginTop: 16,
      paddingVertical: 20,
      paddingHorizontal: 18,
      borderRadius: 18,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: p.hairline,
      backgroundColor: p.inkSunken,
    },
    statsDivider: {
      width: StyleSheet.hairlineWidth,
      backgroundColor: p.hairlineStrong,
      marginHorizontal: 16,
    },
  });
