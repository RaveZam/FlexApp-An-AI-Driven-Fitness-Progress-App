import { FontFamilies } from "@/constants/theme";
import { usePalette, type Palette } from "@/src/theme";
import { Ionicons } from "@expo/vector-icons";
import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import type { Workout } from "../../types";

type Props = { workout: Workout; editing: boolean };

export function WorkoutDetailMasthead({ workout, editing }: Props) {
  const p = usePalette();
  const styles = useMemo(() => makeStyles(p), [p]);
  const count = workout.exercises.length;

  return (
    <Animated.View
      entering={FadeInDown.delay(40).duration(420)}
      style={styles.masthead}
    >
      <Text style={styles.eyebrow}>{editing ? "Editing" : "Workout"}</Text>
      <Text style={styles.title} numberOfLines={2}>
        {workout.name}
      </Text>
      <View style={styles.statRow}>
        <Ionicons name="barbell-outline" size={13} color={p.muted} />
        <Text style={styles.statText}>
          {count} exercise{count !== 1 ? "s" : ""}
        </Text>
      </View>
    </Animated.View>
  );
}

const makeStyles = (p: Palette) =>
  StyleSheet.create({
    masthead: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 18 },
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
      fontSize: 34,
      fontFamily: FontFamilies.displayLight,
      letterSpacing: -0.8,
      lineHeight: 38,
    },
    statRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      marginTop: 14,
    },
    statText: {
      color: p.muted,
      fontSize: 12.5,
      fontFamily: FontFamilies.regular,
      letterSpacing: 0.2,
    },
  });
