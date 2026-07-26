import { usePalette, type Palette } from "@/src/theme";
import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import HeroElapsedTime from "./HeroElapsedTime";
import HeroRestTime from "./HeroRestTime";

export default function SessionTimerHero() {
  const p = usePalette();
  const styles = useMemo(() => makeStyles(p), [p]);
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

const makeStyles = (p: Palette) =>
  StyleSheet.create({
    timerHero: {
      flexDirection: "row",
      alignItems: "stretch",
      paddingHorizontal: 24,
      paddingVertical: 22,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: p.hairline,
    },
    timerDivider: {
      width: StyleSheet.hairlineWidth,
      backgroundColor: p.hairlineStrong,
      marginHorizontal: 18,
    },
  });
