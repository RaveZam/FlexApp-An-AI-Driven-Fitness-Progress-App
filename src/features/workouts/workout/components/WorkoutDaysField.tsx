import { usePalette, type Palette } from "@/src/theme";
import { useMemo } from "react";
import { StyleSheet, Text } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import DayPicker from "./DayPicker";

type Props = { selected: number[]; onToggle: (day: number) => void };

export function WorkoutDaysField({ selected, onToggle }: Props) {
  const p = usePalette();
  const styles = useMemo(() => makeStyles(p), [p]);

  return (
    <Animated.View entering={FadeInDown.delay(140).duration(350)}>
      <Text style={styles.label}>Days</Text>
      <DayPicker selected={selected} onToggle={onToggle} />
    </Animated.View>
  );
}

const makeStyles = (p: Palette) =>
  StyleSheet.create({
    label: {
      color: p.muted,
      fontSize: 11,
      fontFamily: "Inter_500Medium",
      letterSpacing: 0.8,
      textTransform: "uppercase",
      marginBottom: 10,
    },
  });
