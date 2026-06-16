import { StyleSheet, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { useWorkoutSession } from "../hooks/useWorkoutSession";
import Last7SessionsPanel from "./Last7SessionsPanel";
import PersonalRecordPanel from "./PersonalRecordPanel";

const HAIRLINE = "rgba(245,243,239,0.07)";
const HAIRLINE_STRONG = "rgba(245,243,239,0.14)";

export default function SessionStatsPanel() {
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

const styles = StyleSheet.create({
  statsPanel: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginTop: 16,
    paddingVertical: 20,
    paddingHorizontal: 18,
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: HAIRLINE,
    backgroundColor: "#0a0a0a",
  },
  statsDivider: {
    width: StyleSheet.hairlineWidth,
    backgroundColor: HAIRLINE_STRONG,
    marginHorizontal: 16,
  },
});
