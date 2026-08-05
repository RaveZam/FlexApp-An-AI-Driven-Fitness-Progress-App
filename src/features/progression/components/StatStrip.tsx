import { FontFamilies } from "@/constants/theme";
import { usePalette, type Palette } from "@/src/theme";
import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";

type Cell = { label: string; value: string };

export function StatStrip({ cells }: { cells: Cell[] }) {
  const p = usePalette();
  const styles = useMemo(() => makeStyles(p), [p]);
  return (
    <View style={styles.row}>
      {cells.map((cell, i) => (
        <View key={cell.label} style={styles.cellWrap}>
          {i > 0 && <View style={styles.divider} />}
          <View style={styles.cell}>
            <Text style={styles.value}>{cell.value}</Text>
            <Text style={styles.label}>{cell.label}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const makeStyles = (p: Palette) =>
  StyleSheet.create({
  row: {
    marginHorizontal: 20,
    marginTop: 16,
    flexDirection: "row",
    borderRadius: 16,
    backgroundColor: p.inkRaised,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: p.hairlineStrong,
    overflow: "hidden",
  },
  cellWrap: { flex: 1, flexDirection: "row" },
  divider: {
    width: StyleSheet.hairlineWidth,
    backgroundColor: p.hairlineStrong,
  },
  cell: { flex: 1, alignItems: "center", paddingVertical: 14, gap: 4 },
  value: {
    color: p.bone,
    fontSize: 17,
    fontFamily: FontFamilies.semibold,
    letterSpacing: -0.3,
    fontVariant: ["tabular-nums"],
  },
  label: {
    color: p.muted,
    fontSize: 9,
    fontFamily: FontFamilies.medium,
    letterSpacing: 1.6,
    textTransform: "uppercase",
  },
});
