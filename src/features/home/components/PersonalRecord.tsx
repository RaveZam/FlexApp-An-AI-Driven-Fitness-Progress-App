import { FontFamilies, Palette } from "@/constants/theme";
import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

export function PersonalRecord() {
  return (
    <Animated.View entering={FadeInDown.delay(360).duration(400)} style={styles.card}>
      <LinearGradient
        colors={["rgba(52,211,153,0.10)", "rgba(52,211,153,0)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />

      <View style={styles.inner}>
        <View style={styles.medallion}>
          <View style={styles.medallionInner}>
            <Ionicons name="trophy" size={22} color={Palette.accent} />
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

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 20,
    borderRadius: 18,
    backgroundColor: Palette.inkRaised,
    overflow: "hidden",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Palette.hairlineStrong,
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
    borderColor: Palette.accentBorder,
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
  },
  medallionInner: {
    flex: 1,
    width: "100%",
    borderRadius: 26,
    backgroundColor: "rgba(52,211,153,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  eyebrow: {
    color: Palette.accent,
    fontSize: 9,
    fontFamily: FontFamilies.medium,
    letterSpacing: 2.2,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  name: {
    color: Palette.bone,
    fontSize: 17,
    fontFamily: FontFamilies.displayMedium,
    letterSpacing: -0.3,
    marginBottom: 2,
  },
  delta: {
    color: Palette.bone,
    fontSize: 11,
    fontFamily: FontFamilies.medium,
    fontVariant: ["tabular-nums"],
  },
  deltaMuted: { color: Palette.muted, fontFamily: FontFamilies.regular },
  valueBlock: { alignItems: "flex-end" },
  valueRow: { flexDirection: "row", alignItems: "baseline", gap: 3 },
  value: {
    color: Palette.bone,
    fontSize: 32,
    fontFamily: FontFamilies.displayLight,
    letterSpacing: -1,
    fontVariant: ["tabular-nums"],
    lineHeight: 34,
  },
  valueUnit: {
    color: Palette.muted,
    fontSize: 12,
    fontFamily: FontFamilies.displayRegular,
    letterSpacing: 0.4,
  },
  subValue: {
    color: Palette.muted,
    fontSize: 11,
    fontFamily: FontFamilies.regular,
    marginTop: 2,
  },
  subValueAccent: { color: Palette.accent, fontFamily: FontFamilies.medium },
});
