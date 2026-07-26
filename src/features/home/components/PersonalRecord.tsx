import { FontFamilies } from "@/constants/theme";
import { usePalette, type Palette } from "@/src/theme";
import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

export function PersonalRecord() {
  const p = usePalette();
  const styles = useMemo(() => makeStyles(p), [p]);
  return (
    <Animated.View entering={FadeInDown.delay(360).duration(400)} style={styles.card}>
      <LinearGradient
        colors={[p.accentSoft, "transparent"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />

      <View style={styles.inner}>
        <View style={styles.medallion}>
          <View style={styles.medallionInner}>
            <Ionicons name="trophy" size={22} color={p.accent} />
          </View>
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.eyebrow}>New Personal Record</Text>
          <Text style={styles.name}>Back Squat</Text>
          <Text style={styles.delta}>
            +10 <Text style={styles.deltaMuted}>lbs from last week</Text>
          </Text>
        </View>

        <View style={styles.valueBlock}>
          <View style={styles.valueRow}>
            <Text style={styles.value}>315</Text>
            <Text style={styles.valueUnit}>lb</Text>
          </View>
          <Text style={styles.subValue}>
            × <Text style={styles.subValueAccent}>5</Text>
          </Text>
        </View>
      </View>
    </Animated.View>
  );
}

const makeStyles = (p: Palette) =>
  StyleSheet.create({
    card: {
      marginHorizontal: 20,
      borderRadius: 18,
      backgroundColor: p.inkRaised,
      overflow: "hidden",
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: p.hairlineStrong,
    },
    inner: {
      flexDirection: "row",
      alignItems: "center",
      padding: 18,
      gap: 14,
    },
    medallion: {
      width: 56,
      height: 56,
      borderRadius: 28,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: p.accentBorder,
      alignItems: "center",
      justifyContent: "center",
      padding: 5,
    },
    medallionInner: {
      flex: 1,
      width: "100%",
      borderRadius: 26,
      backgroundColor: p.accentSoft,
      alignItems: "center",
      justifyContent: "center",
    },
    eyebrow: {
      color: p.accent,
      fontSize: 9,
      fontFamily: FontFamilies.medium,
      letterSpacing: 2.2,
      textTransform: "uppercase",
      marginBottom: 4,
    },
    name: {
      color: p.bone,
      fontSize: 17,
      fontFamily: FontFamilies.displayMedium,
      letterSpacing: -0.3,
      marginBottom: 2,
    },
    delta: {
      color: p.bone,
      fontSize: 11,
      fontFamily: FontFamilies.medium,
      fontVariant: ["tabular-nums"],
    },
    deltaMuted: { color: p.muted, fontFamily: FontFamilies.regular },
    valueBlock: { alignItems: "flex-end" },
    valueRow: { flexDirection: "row", alignItems: "baseline", gap: 3 },
    value: {
      color: p.bone,
      fontSize: 32,
      fontFamily: FontFamilies.displayLight,
      letterSpacing: -1,
      fontVariant: ["tabular-nums"],
      lineHeight: 34,
    },
    valueUnit: {
      color: p.muted,
      fontSize: 12,
      fontFamily: FontFamilies.displayRegular,
      letterSpacing: 0.4,
    },
    subValue: {
      color: p.muted,
      fontSize: 11,
      fontFamily: FontFamilies.regular,
      marginTop: 2,
    },
    subValueAccent: { color: p.accent, fontFamily: FontFamilies.medium },
  });
