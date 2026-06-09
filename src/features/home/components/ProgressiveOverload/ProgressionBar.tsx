import { Palette } from "@/constants/theme";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import ReAnimated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";

export const CHART_HEIGHT = 42;
export const BAR_WIDTH = 9;
export const BAR_GAP = 7;

type Props = {
  index: number;
  heightPx: number;
  restingOpacity: number;
  isBest: boolean;
  isLatest: boolean;
};

export function ProgressionBar({ index, heightPx, restingOpacity, isBest, isLatest }: Props) {
  const grow = useSharedValue(0);
  useEffect(() => {
    grow.value = withDelay(
      140 + index * 55,
      withTiming(1, { duration: 420, easing: Easing.out(Easing.cubic) })
    );
  }, [grow, index]);

  const growStyle = useAnimatedStyle(() => ({ height: heightPx * grow.value }));

  return (
    <View style={styles.column}>
      {/* Cap dot marks the most recent session at a glance. */}
      <View style={[styles.cap, isLatest ? styles.capActive : styles.capHidden]} />
      <ReAnimated.View
        style={[styles.bar, { opacity: isBest ? 1 : restingOpacity }, growStyle]}
      >
        <LinearGradient
          colors={
            isBest
              ? [Palette.accent, Palette.accentDeep]
              : [Palette.accent, "rgba(52,211,153,0.22)"]
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      </ReAnimated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  column: {
    width: BAR_WIDTH,
    height: CHART_HEIGHT,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  cap: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginBottom: 4,
  },
  capActive: { backgroundColor: Palette.accent },
  capHidden: { backgroundColor: "transparent" },
  bar: {
    width: BAR_WIDTH,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
    overflow: "hidden",
  },
});
