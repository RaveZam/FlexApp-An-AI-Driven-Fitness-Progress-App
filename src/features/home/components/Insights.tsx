import { FontFamilies, Palette } from "@/constants/theme";
import { Feather, Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { InsightCard } from "./InsightCard";

export function Insights() {
  return (
    <Animated.View entering={FadeInDown.delay(440).duration(400)} style={styles.wrap}>
      <Text style={styles.eyebrow}>Signals</Text>
      <Text style={styles.title}>Your Insights</Text>

      <View style={styles.list}>
        <InsightCard
          icon={<Feather name="bar-chart-2" size={20} color={Palette.accent} />}
          mainText="You lifted 12% more total weight this week"
          subText="Progressive overload is working — keep the cadence"
        />
        <InsightCard
          icon={<Ionicons name="flash" size={20} color={Palette.accent} />}
          mainText="On track to hit monthly goal early"
          subText="At this pace, you'll reach 240,000 lbs by Jan 25"
        />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: 20 },
  eyebrow: {
    color: Palette.accent,
    fontSize: 9,
    fontFamily: FontFamilies.medium,
    letterSpacing: 2.4,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  title: {
    color: Palette.bone,
    fontSize: 22,
    fontFamily: FontFamilies.displayMedium,
    letterSpacing: -0.4,
    marginBottom: 14,
  },
  list: { gap: 10 },
});
