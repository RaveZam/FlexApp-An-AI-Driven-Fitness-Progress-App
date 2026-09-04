import { usePalette } from "@/src/theme";
import { useEffect } from "react";
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { loadRung } from "../sessionStats";

/** Full height of a maxed-out week. A quiet week still shows its floor. */
export const SKYLINE_HEIGHT = 62;
const FLOOR_HEIGHT = 2;

type Props = {
  volume: number;
  peak: number;
  index: number;
  ladder: string[];
};

export default function SkylineTick({ volume, peak, index, ladder }: Props) {
  const p = usePalette();
  const reduceMotion = useReducedMotion();

  const ratio = peak > 0 ? volume / peak : 0;
  const height =
    volume > 0 ? FLOOR_HEIGHT + ratio * (SKYLINE_HEIGHT - FLOOR_HEIGHT) : FLOOR_HEIGHT;

  const grow = useSharedValue(0);
  useEffect(() => {
    grow.value = reduceMotion
      ? 1
      : withDelay(
          120 + index * 16,
          withTiming(1, { duration: 380, easing: Easing.out(Easing.cubic) }),
        );
  }, [grow, index, reduceMotion]);

  const growStyle = useAnimatedStyle(() => ({ height: height * grow.value }));

  return (
    <Animated.View
      style={[
        {
          flex: 1,
          backgroundColor: volume > 0 ? ladder[loadRung(volume, peak)] : p.mutedSoft,
        },
        growStyle,
      ]}
    />
  );
}
