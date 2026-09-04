import { FontFamilies } from "@/constants/theme";
import { usePalette, type Palette } from "@/src/theme";
import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { SPINE_GUTTER, SPINE_X } from "./spine";

export default function HistoryEmptyState() {
  const p = usePalette();
  const styles = useMemo(() => makeStyles(p), [p]);

  return (
    <Animated.View entering={FadeIn.duration(320)} style={styles.row}>
      <View style={styles.gutter}>
        <View style={styles.rule} />
        <View style={styles.node} />
      </View>
      <View style={styles.body}>
        <Text style={styles.title}>The ledger starts here</Text>
        <Text style={styles.copy}>
          Finish a workout and it lands on this line, weighted by how much you moved.
        </Text>
      </View>
    </Animated.View>
  );
}

const makeStyles = (p: Palette) =>
  StyleSheet.create({
    row: {
      flexDirection: "row",
      paddingTop: 28,
    },
    gutter: { width: SPINE_GUTTER, height: 96 },
    rule: {
      position: "absolute",
      left: SPINE_X,
      top: 0,
      bottom: 0,
      width: StyleSheet.hairlineWidth,
      backgroundColor: p.hairline,
    },
    node: {
      position: "absolute",
      top: 3,
      left: SPINE_X - 4,
      width: 9,
      height: 9,
      borderRadius: 4.5,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: p.mutedSoft,
    },
    body: { flex: 1, gap: 8 },
    title: {
      fontFamily: FontFamilies.displayExtraLight,
      fontSize: 26,
      color: p.bone,
      letterSpacing: -0.7,
      lineHeight: 30,
    },
    copy: {
      fontFamily: FontFamilies.regular,
      fontSize: 13,
      color: p.muted,
      lineHeight: 20,
      paddingRight: 24,
    },
  });
