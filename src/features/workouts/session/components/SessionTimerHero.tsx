import React from "react";
import { StyleSheet, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import HeroElapsedTime from "./HeroElapsedTime";
import HeroRestTime from "./HeroRestTime";

const HAIRLINE = "rgba(245,243,239,0.07)";
const HAIRLINE_STRONG = "rgba(245,243,239,0.14)";

export default function SessionTimerHero() {
  return (
    <Animated.View
      entering={FadeInDown.delay(60).duration(400)}
      style={styles.timerHero}
    >
      <HeroElapsedTime />
      <View style={styles.timerDivider} />
      <HeroRestTime />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  timerHero: {
    flexDirection: "row",
    alignItems: "stretch",
    paddingHorizontal: 24,
    paddingVertical: 22,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: HAIRLINE,
  },
  timerDivider: {
    width: StyleSheet.hairlineWidth,
    backgroundColor: HAIRLINE_STRONG,
    marginHorizontal: 18,
  },
});
