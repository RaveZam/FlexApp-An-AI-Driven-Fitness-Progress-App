import { usePalette, type Palette } from "@/src/theme";
import { Ionicons } from "@expo/vector-icons";
import { useMemo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

export function CreateCustomWorkoutCard() {
  const p = usePalette();
  const styles = useMemo(() => makeStyles(p), [p]);

  return (
    <Animated.View entering={FadeInDown.delay(700).duration(400)}>
      <TouchableOpacity activeOpacity={0.7}>
        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.glyph}>
              <Ionicons name="add" size={18} color={p.accent} />
            </View>
            <Text style={styles.label}>Create Custom Workout</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const makeStyles = (p: Palette) =>
  StyleSheet.create({
    card: {
      borderRadius: 14,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: p.accentBorderSoft,
      borderStyle: "dashed",
    },
    row: {
      padding: 18,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
    },
    glyph: {
      width: 32,
      height: 32,
      borderRadius: 8,
      backgroundColor: p.accentSoft,
      alignItems: "center",
      justifyContent: "center",
    },
    label: {
      color: p.accent,
      fontSize: 13,
      fontFamily: "Inter_500Medium",
      letterSpacing: 0.3,
    },
  });
