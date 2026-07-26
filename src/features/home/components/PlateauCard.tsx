import { FontFamilies } from "@/constants/theme";
import { usePalette, type Palette } from "@/src/theme";
import { Feather } from "@expo/vector-icons";
import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { usePlateauTracker } from "../hooks/usePlateauTracker";

// No "dangerSoft" fill token exists in the palette (only dangerBorder was added
// during Task 3's review). Nearest-fit: derive a faint fill from the danger token
// itself, at roughly the same alpha ratio accentSoft uses relative to accent.
function dangerSoftFill(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, 0.06)`;
}

export function PlateauCard() {
  const p = usePalette();
  const styles = useMemo(() => makeStyles(p), [p]);
  const { plateaus } = usePlateauTracker();

  if (plateaus.length === 0) return null;

  return (
    <Animated.View entering={FadeInDown.delay(200).duration(400)} style={styles.section}>
      <Text style={styles.title}>Plateaus</Text>
      <View style={{ gap: 10 }}>
        {plateaus.map((plateau) => (
          <View key={plateau.name} style={styles.card}>
            <View style={styles.head}>
              <Feather name="alert-triangle" size={14} color={p.danger} />
              <Text style={styles.name} numberOfLines={1}>
                {plateau.name}
              </Text>
            </View>
            <Text style={styles.stuck}>
              Stuck at {plateau.weight} lb × {plateau.reps} for {plateau.sessionsStuck} sessions
            </Text>
            {plateau.tip ? (
              <Text style={styles.tip}>💡 {plateau.tip}</Text>
            ) : (
              <Text style={styles.tipLoading}>Finding a way through…</Text>
            )}
          </View>
        ))}
      </View>
    </Animated.View>
  );
}

const makeStyles = (p: Palette) =>
  StyleSheet.create({
    section: { marginHorizontal: 20, marginTop: 24, gap: 12 },
    title: {
      color: p.bone,
      fontSize: 22,
      fontFamily: FontFamilies.displayMedium,
      letterSpacing: -0.5,
    },
    card: {
      borderRadius: 14,
      backgroundColor: dangerSoftFill(p.danger),
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: p.dangerBorder,
      padding: 14,
      gap: 6,
    },
    head: { flexDirection: "row", alignItems: "center", gap: 8 },
    name: {
      color: p.bone,
      fontSize: 13,
      fontFamily: FontFamilies.semibold,
      letterSpacing: 0.1,
      flex: 1,
    },
    stuck: {
      color: p.muted,
      fontSize: 11,
      fontFamily: FontFamilies.regular,
      letterSpacing: 0.2,
    },
    tip: {
      color: p.bone,
      fontSize: 12,
      fontFamily: FontFamilies.regular,
      letterSpacing: 0.2,
      lineHeight: 17,
      marginTop: 2,
    },
    tipLoading: {
      color: p.muted,
      fontSize: 11,
      fontFamily: FontFamilies.regular,
      fontStyle: "italic",
    },
  });
