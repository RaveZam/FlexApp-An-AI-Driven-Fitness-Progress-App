import { FontFamilies } from "@/constants/theme";
import { usePalette, type Palette } from "@/src/theme";
import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

type Props = { planCount: number };

export function WorkoutsMasthead({ planCount }: Props) {
  const p = usePalette();
  const styles = useMemo(() => makeStyles(p), [p]);

  return (
    <Animated.View
      entering={FadeInDown.delay(40).duration(420)}
      style={styles.masthead}
    >
      <Text style={styles.eyebrow}>Training Library</Text>
      <Text style={styles.title}>Workouts</Text>

      <View style={styles.statRow}>
        <Text style={styles.statNumber}>
          {String(planCount).padStart(2, "0")}
        </Text>
        <Text style={styles.statLabel}>
          active{"\n"}
          {planCount === 1 ? "plan" : "plans"}
        </Text>
      </View>
    </Animated.View>
  );
}

const makeStyles = (p: Palette) =>
  StyleSheet.create({
    masthead: {
      paddingHorizontal: 20,
      paddingTop: 14,
      paddingBottom: 18,
    },
    eyebrow: {
      color: p.accent,
      fontSize: 10,
      fontFamily: FontFamilies.medium,
      letterSpacing: 3,
      textTransform: "uppercase",
      marginBottom: 8,
    },
    title: {
      color: p.bone,
      fontSize: 40,
      fontFamily: FontFamilies.displayLight,
      letterSpacing: -1,
      lineHeight: 42,
    },
    statRow: {
      flexDirection: "row",
      alignItems: "flex-end",
      gap: 10,
      marginTop: 16,
    },
    statNumber: {
      color: p.bone,
      fontSize: 30,
      fontFamily: FontFamilies.displayMedium,
      letterSpacing: -1,
      lineHeight: 30,
    },
    statLabel: {
      color: p.muted,
      fontSize: 11,
      fontFamily: FontFamilies.regular,
      letterSpacing: 1.4,
      textTransform: "uppercase",
      lineHeight: 14,
      paddingBottom: 1,
    },
  });
