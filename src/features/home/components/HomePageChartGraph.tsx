import { FontFamilies, Palette } from "@/constants/theme";
import Feather from "@expo/vector-icons/Feather";
import { LinearGradient } from "expo-linear-gradient";
import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn, FadeInDown, FadeInUp } from "react-native-reanimated";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function HomePageChartGraph() {
  const dailyVolume = useMemo(
    () => [
      { day: "Mon", volume: 12400 },
      { day: "Tue", volume: 0 },
      { day: "Wed", volume: 15800 },
      { day: "Thu", volume: 9200 },
      { day: "Fri", volume: 18600 },
      { day: "Sat", volume: 0 },
      { day: "Sun", volume: 0 },
    ],
    []
  );

  const today = DAYS[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1];
  const totalVolume = dailyVolume.reduce((sum, d) => sum + d.volume, 0);
  const activeDays = dailyVolume.filter((d) => d.volume > 0).length;
  const avgVolume = activeDays > 0 ? Math.round(totalVolume / activeDays) : 0;
  const maxVolume = dailyVolume.reduce((m, d) => Math.max(m, d.volume), 0);
  const bestDay = dailyVolume.reduce((b, d) => (d.volume > b.volume ? d : b), dailyVolume[0]);

  const formatVolume = (v: number) => {
    if (v >= 1000) return `${(v / 1000).toFixed(1).replace(/\.0$/, "")}k`;
    return `${v}`;
  };

  return (
    <Animated.View entering={FadeInDown.delay(250).duration(400)} style={styles.card}>
      <LinearGradient
        colors={["rgba(52,211,153,0.07)", "rgba(52,211,153,0)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />

      <View style={styles.body}>
        <Animated.View entering={FadeIn.delay(400).duration(500)} style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>Weekly Volume</Text>
            <View style={styles.valueRow}>
              <Text style={styles.value}>{formatVolume(totalVolume)}</Text>
              <Text style={styles.unit}>lbs</Text>
            </View>
          </View>

          <Animated.View entering={FadeInUp.delay(600).duration(400)} style={styles.trendChip}>
            <Feather name="trending-up" size={11} color={Palette.accent} />
            <Text style={styles.trendText}>+8%</Text>
          </Animated.View>
        </Animated.View>

        {/* Custom bar chart */}
        <View style={styles.chartWrap}>
          <View style={styles.chartBaseline} />
          <View style={styles.chartRow}>
            {dailyVolume.map((d, i) => {
              const isToday = d.day === today;
              const isRest = d.volume === 0;
              const ratio = maxVolume > 0 ? d.volume / maxVolume : 0;
              const heightPx = isRest ? 4 : Math.max(6, ratio * 84);
              return (
                <View key={d.day} style={styles.barCol}>
                  <View
                    style={{
                      width: 10,
                      height: heightPx,
                      borderRadius: 2,
                      overflow: "hidden",
                      opacity: isRest ? 0.5 : isToday ? 1 : 0.6,
                    }}
                  >
                    {isRest ? (
                      <View style={{ flex: 1, backgroundColor: Palette.hairlineStrong }} />
                    ) : (
                      <LinearGradient
                        colors={
                          isToday
                            ? [Palette.accent, Palette.accentDeep]
                            : [Palette.accent, "rgba(52,211,153,0.35)"]
                        }
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0, y: 1 }}
                        style={{ flex: 1 }}
                      />
                    )}
                  </View>
                  <Text
                    style={[
                      styles.barLabel,
                      { color: isToday ? Palette.accent : Palette.mutedSoft },
                    ]}
                  >
                    {d.day.slice(0, 1)}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      </View>

      {/* Stats strip */}
      <View style={styles.statsStrip}>
        <Stat label="Avg / Session" value={`${formatVolume(avgVolume)}`} unit="lbs" />
        <View style={styles.statDivider} />
        <Stat label="Sessions" value={`${activeDays}`} unit="/ 7" />
        <View style={styles.statDivider} />
        <Stat label="Best Day" value={bestDay.day} accent />
      </View>
    </Animated.View>
  );
}

function Stat({
  label,
  value,
  unit,
  accent,
}: {
  label: string;
  value: string;
  unit?: string;
  accent?: boolean;
}) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statLabel}>{label}</Text>
      <View style={styles.statValueRow}>
        <Text style={[styles.statValue, accent && { color: Palette.accent }]}>{value}</Text>
        {unit ? <Text style={styles.statUnit}>{unit}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 20,
    borderRadius: 18,
    backgroundColor: Palette.inkRaised,
    overflow: "hidden",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Palette.hairlineStrong,
  },
  body: { padding: 20, paddingBottom: 10 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  eyebrow: {
    color: Palette.muted,
    fontSize: 9,
    fontFamily: FontFamilies.medium,
    letterSpacing: 2.2,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  valueRow: { flexDirection: "row", alignItems: "baseline", gap: 6 },
  value: {
    color: Palette.bone,
    fontSize: 36,
    fontFamily: FontFamilies.displayLight,
    letterSpacing: -1,
    fontVariant: ["tabular-nums"],
    lineHeight: 40,
  },
  unit: {
    color: Palette.muted,
    fontSize: 13,
    fontFamily: FontFamilies.displayRegular,
    letterSpacing: 0.5,
  },
  trendChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Palette.accentBorderSoft,
    backgroundColor: "rgba(52,211,153,0.06)",
  },
  trendText: {
    color: Palette.accent,
    fontSize: 11,
    fontFamily: FontFamilies.medium,
    letterSpacing: 0.4,
    fontVariant: ["tabular-nums"],
  },

  chartWrap: { position: "relative", marginTop: 6 },
  chartBaseline: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 22,
    height: StyleSheet.hairlineWidth,
    backgroundColor: Palette.hairline,
  },
  chartRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: 110,
  },
  barCol: {
    alignItems: "center",
    justifyContent: "flex-end",
    flex: 1,
  },
  barLabel: {
    fontSize: 9,
    fontFamily: FontFamilies.medium,
    letterSpacing: 1.6,
    marginTop: 8,
  },

  statsStrip: {
    flexDirection: "row",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Palette.hairline,
  },
  stat: { flex: 1, paddingVertical: 14, alignItems: "center" },
  statDivider: {
    width: StyleSheet.hairlineWidth,
    backgroundColor: Palette.hairline,
    marginVertical: 12,
  },
  statLabel: {
    color: Palette.muted,
    fontSize: 9,
    fontFamily: FontFamilies.medium,
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  statValueRow: { flexDirection: "row", alignItems: "baseline", gap: 3 },
  statValue: {
    color: Palette.bone,
    fontSize: 16,
    fontFamily: FontFamilies.displayMedium,
    letterSpacing: -0.2,
    fontVariant: ["tabular-nums"],
  },
  statUnit: {
    color: Palette.mutedSoft,
    fontSize: 10,
    fontFamily: FontFamilies.regular,
    letterSpacing: 0.4,
  },
});
