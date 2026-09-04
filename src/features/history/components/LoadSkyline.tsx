import { loadLadder, usePalette, type Palette } from "@/src/theme";
import { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import type { WeekLoad } from "../sessionStats";
import SkylineTick, { SKYLINE_HEIGHT } from "./SkylineTick";

export default function LoadSkyline({
  weeks,
  peak,
}: {
  weeks: WeekLoad[];
  peak: number;
}) {
  const p = usePalette();
  const styles = useMemo(() => makeStyles(p), [p]);
  const ladder = useMemo(() => loadLadder(p), [p]);

  return (
    <View>
      <View style={styles.ticks}>
        {weeks.map((week, index) => (
          <SkylineTick
            key={week.key}
            volume={week.volume}
            peak={peak}
            index={index}
            ladder={ladder}
          />
        ))}
      </View>
      <View style={styles.baseline} />
    </View>
  );
}

const makeStyles = (p: Palette) =>
  StyleSheet.create({
    ticks: {
      height: SKYLINE_HEIGHT,
      flexDirection: "row",
      alignItems: "flex-end",
      gap: 3,
    },
    baseline: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: p.hairlineStrong,
    },
  });
