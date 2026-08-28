import { loadLadder, usePalette, type Palette } from "@/src/theme";
import { useEffect, useMemo } from "react";
import { Pressable, StyleSheet, View } from "react-native";
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
  /** 0 = oldest session in view, 1 = newest. Drives the resting rung. */
  positionRatio: number;
  isBest: boolean;
  isLatest: boolean;
  isSelected?: boolean;
  onPress?: () => void;
};

// Blend two #rrggbb colors. t=0 -> a, t=1 -> b.
function mixHex(a: string, b: string, t: number): string {
  const from = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const to = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  const hex = from
    .map((v, i) =>
      Math.round(v + (to[i] - v) * t)
        .toString(16)
        .padStart(2, "0"),
    )
    .join("");
  return `#${hex}`;
}

// Resting bars climb the bottom three rungs of the load ladder by recency.
// The top two rungs (bright, lime) are held back for the latest session and a PR.
function restingColor(p: Palette, ratio: number): string {
  const rungs = loadLadder(p).slice(0, 3);
  const span = Math.max(0, Math.min(1, ratio)) * (rungs.length - 1);
  const lo = Math.min(rungs.length - 2, Math.floor(span));
  return mixHex(rungs[lo], rungs[lo + 1], span - lo);
}

export function ProgressionBar({
  index,
  heightPx,
  positionRatio,
  isBest,
  isLatest,
  isSelected,
  onPress,
}: Props) {
  const p = usePalette();
  const styles = useMemo(() => makeStyles(p), [p]);

  // Hue carries recency now, so bars sit at full opacity; a PR gets the top
  // rung, the latest (or tapped) session the one below it.
  const fill = isBest
    ? p.accentLime
    : isLatest || isSelected
      ? p.accentBright
      : restingColor(p, positionRatio);

  const grow = useSharedValue(0);
  useEffect(() => {
    grow.value = withDelay(
      140 + index * 55,
      withTiming(1, { duration: 420, easing: Easing.out(Easing.cubic) }),
    );
  }, [grow, index]);

  const growStyle = useAnimatedStyle(() => ({ height: heightPx * grow.value }));

  const bar = (
    <View style={styles.column}>
      {/* Cap dot marks the most recent session at a glance. */}
      <View
        style={[styles.cap, { backgroundColor: isLatest ? fill : "transparent" }]}
      />
      <ReAnimated.View
        style={[
          styles.bar,
          { backgroundColor: fill },
          isSelected && styles.barSelected,
          growStyle,
        ]}
      />
    </View>
  );

  if (!onPress) return bar;

  return (
    <Pressable hitSlop={6} onPress={onPress}>
      {bar}
    </Pressable>
  );
}

const makeStyles = (p: Palette) =>
  StyleSheet.create({
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
    bar: {
      width: BAR_WIDTH,
      borderTopLeftRadius: 3,
      borderTopRightRadius: 3,
      overflow: "hidden",
    },
    barSelected: {
      borderWidth: 1,
      borderColor: p.bone,
    },
  });
