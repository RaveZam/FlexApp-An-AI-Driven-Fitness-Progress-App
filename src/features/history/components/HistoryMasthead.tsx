import { FontFamilies } from "@/constants/theme";
import { usePalette, type Palette } from "@/src/theme";
import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { formatVolume, type OverviewStats, type WeekLoad } from "../sessionStats";
import LoadSkyline from "./LoadSkyline";
import { SPINE_GUTTER } from "./spine";

type Props = {
  stats: OverviewStats;
  weeks: WeekLoad[];
  peakWeek: number;
};

export default function HistoryMasthead({ stats, weeks, peakWeek }: Props) {
  const p = usePalette();
  const styles = useMemo(() => makeStyles(p), [p]);

  const ledger = [
    { value: String(stats.total), label: "Sessions" },
    { value: formatVolume(stats.monthVolume), label: "Lb this month" },
    { value: String(stats.streak), label: "Day streak" },
  ];

  return (
    <Animated.View entering={FadeIn.duration(320)} style={styles.wrap}>
      <View style={styles.folio}>
        <Text style={styles.folioMark}>Ledger</Text>
        <Text style={styles.folioRange}>{weeks.length} weeks</Text>
      </View>

      <LoadSkyline weeks={weeks} peak={peakWeek} />

      <View style={styles.ledger}>
        {ledger.map((stat, index) => (
          <View key={stat.label} style={styles.ledgerCell}>
            {index > 0 && <View style={styles.ledgerRule} />}
            <View style={styles.ledgerText}>
              <Text style={styles.ledgerValue}>{stat.value}</Text>
              <Text style={styles.ledgerLabel}>{stat.label}</Text>
            </View>
          </View>
        ))}
      </View>
    </Animated.View>
  );
}

const makeStyles = (p: Palette) =>
  StyleSheet.create({
    wrap: {
      paddingTop: 6,
      paddingBottom: 4,
      // Shares the entries' left edge so the spine gutter runs clean beside it.
      paddingLeft: SPINE_GUTTER,
    },
    folio: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 14,
    },
    folioMark: {
      fontFamily: FontFamilies.medium,
      fontSize: 9,
      color: p.accent,
      letterSpacing: 2.6,
      textTransform: "uppercase",
    },
    folioRange: {
      fontFamily: FontFamilies.medium,
      fontSize: 9,
      color: p.mutedSoft,
      letterSpacing: 1.8,
      textTransform: "uppercase",
    },
    ledger: {
      flexDirection: "row",
      marginTop: 18,
    },
    ledgerCell: {
      flex: 1,
      flexDirection: "row",
    },
    ledgerRule: {
      width: StyleSheet.hairlineWidth,
      backgroundColor: p.hairline,
      marginRight: 16,
    },
    ledgerText: {
      flex: 1,
      gap: 5,
    },
    ledgerValue: {
      fontFamily: FontFamilies.displayLight,
      fontSize: 26,
      color: p.bone,
      letterSpacing: -0.6,
      lineHeight: 28,
      fontVariant: ["tabular-nums"],
    },
    ledgerLabel: {
      fontFamily: FontFamilies.medium,
      fontSize: 9,
      color: p.muted,
      letterSpacing: 1.5,
      textTransform: "uppercase",
    },
  });
