import { FontFamilies, Palette } from "@/constants/theme";
import { Feather } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { usePlateauTracker } from "../hooks/usePlateauTracker";

export function PlateauCard() {
  const { plateaus } = usePlateauTracker();

  if (plateaus.length === 0) return null;

  return (
    <Animated.View entering={FadeInDown.delay(200).duration(400)} style={styles.section}>
      <Text style={styles.title}>Plateaus</Text>
      <View style={{ gap: 10 }}>
        {plateaus.map((p) => (
          <View key={p.name} style={styles.card}>
            <View style={styles.head}>
              <Feather name="alert-triangle" size={14} color={Palette.danger} />
              <Text style={styles.name} numberOfLines={1}>
                {p.name}
              </Text>
            </View>
            <Text style={styles.stuck}>
              Stuck at {p.weight} lb × {p.reps} for {p.sessionsStuck} sessions
            </Text>
            {p.tip ? (
              <Text style={styles.tip}>💡 {p.tip}</Text>
            ) : (
              <Text style={styles.tipLoading}>Finding a way through…</Text>
            )}
          </View>
        ))}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  section: { marginHorizontal: 20, marginTop: 24, gap: 12 },
  title: {
    color: Palette.bone,
    fontSize: 22,
    fontFamily: FontFamilies.displayMedium,
    letterSpacing: -0.5,
  },
  card: {
    borderRadius: 14,
    backgroundColor: "rgba(248,113,113,0.05)",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(248,113,113,0.2)",
    padding: 14,
    gap: 6,
  },
  head: { flexDirection: "row", alignItems: "center", gap: 8 },
  name: {
    color: Palette.bone,
    fontSize: 13,
    fontFamily: FontFamilies.semibold,
    letterSpacing: 0.1,
    flex: 1,
  },
  stuck: {
    color: Palette.muted,
    fontSize: 11,
    fontFamily: FontFamilies.regular,
    letterSpacing: 0.2,
  },
  tip: {
    color: Palette.bone,
    fontSize: 12,
    fontFamily: FontFamilies.regular,
    letterSpacing: 0.2,
    lineHeight: 17,
    marginTop: 2,
  },
  tipLoading: {
    color: Palette.muted,
    fontSize: 11,
    fontFamily: FontFamilies.regular,
    fontStyle: "italic",
  },
});
