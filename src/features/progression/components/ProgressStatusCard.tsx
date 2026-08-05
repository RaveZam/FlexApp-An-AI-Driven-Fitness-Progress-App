import { FontFamilies } from "@/constants/theme";
import { usePalette, type Palette } from "@/src/theme";
import { Feather } from "@expo/vector-icons";
import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  isPlateaued: boolean;
  weight: number;
  reps: number;
  sessionsStuck: number;
};

export function ProgressStatusCard({ isPlateaued, weight, reps, sessionsStuck }: Props) {
  const p = usePalette();
  const styles = useMemo(() => makeStyles(p), [p]);
  if (isPlateaued) {
    return (
      <View style={[styles.card, styles.cardDanger]}>
        <View style={styles.head}>
          <Feather name="alert-triangle" size={14} color={p.danger} />
          <Text style={styles.title}>Plateau</Text>
        </View>
        <Text style={styles.body}>
          Stuck at {weight} lb × {reps} for {sessionsStuck} sessions.
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.card, styles.cardAccent]}>
      <View style={styles.head}>
        <Feather name="trending-up" size={14} color={p.accent} />
        <Text style={[styles.title, { color: p.accent }]}>Progressing</Text>
      </View>
      <Text style={styles.body}>Setting new PRs — keep the current plan going.</Text>
    </View>
  );
}

const makeStyles = (p: Palette) =>
  StyleSheet.create({
  card: {
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 14,
    padding: 14,
    gap: 6,
    borderWidth: StyleSheet.hairlineWidth,
  },
  cardDanger: {
    backgroundColor: p.dangerSoft,
    borderColor: p.dangerBorder,
  },
  cardAccent: {
    backgroundColor: p.accentSoft,
    borderColor: p.accentBorderSoft,
  },
  head: { flexDirection: "row", alignItems: "center", gap: 8 },
  title: {
    color: p.danger,
    fontSize: 13,
    fontFamily: FontFamilies.semibold,
    letterSpacing: 0.1,
  },
  body: {
    color: p.muted,
    fontSize: 11,
    fontFamily: FontFamilies.regular,
    letterSpacing: 0.2,
    lineHeight: 16,
  },
});
