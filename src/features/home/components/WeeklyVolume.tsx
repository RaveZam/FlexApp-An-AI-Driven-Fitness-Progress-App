import { FontFamilies } from "@/constants/theme";
import { usePalette, type Palette } from "@/src/theme";
import { Feather } from "@expo/vector-icons";
import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

const GOAL = 60000;
const CURRENT = 47250;

export function WeeklyVolume() {
  const p = usePalette();
  const styles = useMemo(() => makeStyles(p), [p]);
  const progress = Math.min(1, CURRENT / GOAL);
  const pct = Math.round(progress * 100);

  return (
    <Animated.View entering={FadeInDown.delay(330).duration(400)} style={styles.card}>
      <View style={styles.row}>
        <View>
          <Text style={styles.eyebrow}>Weekly Goal</Text>
          <View style={styles.valueRow}>
            <Text style={styles.pct}>{pct}</Text>
            <Text style={styles.pctUnit}>%</Text>
          </View>
        </View>
        <View style={styles.trendChip}>
          <Feather name="trending-up" size={11} color={p.accent} />
          <Text style={styles.trendText}>+12%</Text>
        </View>
      </View>

      <View style={styles.track}>
        <View style={[styles.fill, { width: `${pct}%` }]} />
      </View>

      <View style={styles.captionRow}>
        <Text style={styles.captionLeft}>
          <Text style={styles.captionAccent}>{CURRENT.toLocaleString()}</Text>
          <Text style={styles.captionMuted}> lbs lifted</Text>
        </Text>
        <Text style={styles.captionRight}>
          of <Text style={styles.captionAccent}>{GOAL.toLocaleString()}</Text>
        </Text>
      </View>
    </Animated.View>
  );
}

const makeStyles = (p: Palette) =>
  StyleSheet.create({
    card: {
      marginHorizontal: 20,
      borderRadius: 18,
      backgroundColor: p.inkSunken,
      paddingHorizontal: 20,
      paddingVertical: 18,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: p.hairline,
    },
    row: {
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-between",
      marginBottom: 16,
    },
    eyebrow: {
      color: p.muted,
      fontSize: 9,
      fontFamily: FontFamilies.medium,
      letterSpacing: 2.2,
      textTransform: "uppercase",
      marginBottom: 6,
    },
    valueRow: { flexDirection: "row", alignItems: "baseline" },
    pct: {
      color: p.bone,
      fontSize: 32,
      fontFamily: FontFamilies.displayLight,
      letterSpacing: -1,
      fontVariant: ["tabular-nums"],
      lineHeight: 34,
    },
    pctUnit: {
      color: p.muted,
      fontSize: 14,
      fontFamily: FontFamilies.displayRegular,
      marginLeft: 2,
    },
    trendChip: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 20,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: p.accentBorderSoft,
      backgroundColor: p.accentSoft,
    },
    trendText: {
      color: p.accent,
      fontSize: 11,
      fontFamily: FontFamilies.medium,
      letterSpacing: 0.4,
      fontVariant: ["tabular-nums"],
    },
    track: {
      height: 2,
      backgroundColor: p.hairline,
      overflow: "hidden",
      borderRadius: 1,
    },
    fill: { height: "100%", backgroundColor: p.accent },
    captionRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "baseline",
      marginTop: 12,
    },
    captionLeft: {
      fontSize: 11,
      fontFamily: FontFamilies.regular,
    },
    captionRight: {
      fontSize: 10,
      fontFamily: FontFamilies.regular,
      color: p.muted,
      letterSpacing: 1,
      textTransform: "uppercase",
    },
    captionAccent: {
      color: p.bone,
      fontFamily: FontFamilies.displayMedium,
      fontVariant: ["tabular-nums"],
    },
    captionMuted: { color: p.muted },
  });
