import { FontFamilies } from "@/constants/theme";
import { usePalette, type Palette } from "@/src/theme";
import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { formatVolume } from "../sessionStats";
import { SPINE_GUTTER, SPINE_X } from "./spine";

type Props = {
  month: string;
  year: number;
  sessions: number;
  volume: number;
};

export default function MonthMarker({ month, year, sessions, volume }: Props) {
  const p = usePalette();
  const styles = useMemo(() => makeStyles(p), [p]);

  return (
    <View style={styles.row}>
      <View style={styles.gutter}>
        <View style={styles.rule} />
        {/* Punches a gap in the spine so the month reads as a cut, not a label. */}
        <View style={styles.notch}>
          <View style={styles.notchRule} />
        </View>
      </View>

      <View style={styles.body}>
        <Text style={styles.month}>
          {month} <Text style={styles.year}>{year}</Text>
        </Text>
        <Text style={styles.meta}>
          {sessions} {sessions === 1 ? "session" : "sessions"} · {formatVolume(volume)} lb
        </Text>
      </View>
    </View>
  );
}

const makeStyles = (p: Palette) =>
  StyleSheet.create({
    row: {
      flexDirection: "row",
      paddingTop: 34,
      paddingBottom: 16,
    },
    gutter: {
      width: SPINE_GUTTER,
    },
    rule: {
      position: "absolute",
      left: SPINE_X,
      top: 0,
      bottom: 0,
      width: StyleSheet.hairlineWidth,
      backgroundColor: p.hairlineStrong,
    },
    notch: {
      position: "absolute",
      left: SPINE_X - 7,
      top: 10,
      width: 15,
      height: 13,
      backgroundColor: p.ink,
      alignItems: "center",
      justifyContent: "center",
    },
    notchRule: {
      width: 15,
      height: StyleSheet.hairlineWidth,
      backgroundColor: p.hairlineStrong,
    },
    body: {
      flex: 1,
      gap: 6,
    },
    month: {
      fontFamily: FontFamilies.displayExtraLight,
      fontSize: 30,
      color: p.bone,
      letterSpacing: -0.8,
      lineHeight: 34,
    },
    year: {
      color: p.mutedSoft,
    },
    meta: {
      fontFamily: FontFamilies.medium,
      fontSize: 9,
      color: p.muted,
      letterSpacing: 1.5,
      textTransform: "uppercase",
    },
  });
