import { FontFamilies } from "@/constants/theme";
import { usePalette, type Palette } from "@/src/theme";
import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";

/** A hairline rule broken by a small uppercase "or", between the primary
 * action and the Google button. */
export default function AuthDivider() {
  const p = usePalette();
  const styles = useMemo(() => makeStyles(p), [p]);

  return (
    <View style={styles.row}>
      <View style={styles.line} />
      <Text style={styles.label}>or</Text>
      <View style={styles.line} />
    </View>
  );
}

const makeStyles = (p: Palette) =>
  StyleSheet.create({
    row: { flexDirection: "row", alignItems: "center", marginVertical: 22 },
    line: { flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: p.hairlineStrong },
    label: {
      marginHorizontal: 14,
      color: p.muted,
      fontSize: 9,
      fontFamily: FontFamilies.medium,
      letterSpacing: 2,
      textTransform: "uppercase",
    },
  });
