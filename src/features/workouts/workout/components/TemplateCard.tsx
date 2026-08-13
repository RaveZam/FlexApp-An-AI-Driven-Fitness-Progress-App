import { usePalette, type Palette } from "@/src/theme";
import { Ionicons } from "@expo/vector-icons";
import { useMemo } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import type { TemplateSplit } from "../core/templateSplits";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = (SCREEN_WIDTH - 48 - 12) / 2;

type Props = { template: TemplateSplit; index: number };

export function TemplateCard({ template, index }: Props) {
  const p = usePalette();
  const styles = useMemo(() => makeStyles(p), [p]);
  const accentBg = `rgba(${template.accentBgRgb},0.14)`;

  return (
    <Animated.View
      entering={FadeInDown.delay(100 + index * 80).duration(400)}
      style={styles.wrapper}
    >
      <TouchableOpacity activeOpacity={0.7}>
        <View style={styles.card}>
          <View style={[styles.accentStrip, { backgroundColor: template.accent }]} />

          <View style={styles.body}>
            <View style={styles.topRow}>
              <View style={[styles.glyph, { backgroundColor: accentBg }]}>
                <Ionicons
                  name={template.icon}
                  size={20}
                  color={template.accent}
                />
              </View>
              <View style={[styles.badge, { backgroundColor: accentBg }]}>
                <Text style={[styles.badgeText, { color: template.accent }]}>
                  {template.days}x/WK
                </Text>
              </View>
            </View>

            <Text style={styles.name} numberOfLines={1}>
              {template.name}
            </Text>

            <Text style={styles.muscles} numberOfLines={1}>
              {template.muscles}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const makeStyles = (p: Palette) =>
  StyleSheet.create({
    wrapper: { width: CARD_WIDTH },
    card: {
      backgroundColor: p.inkRaised,
      borderRadius: 16,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: p.hairline,
    },
    accentStrip: { height: 3, opacity: 0.8 },
    body: { padding: 14 },
    topRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 10,
    },
    glyph: {
      width: 38,
      height: 38,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
    },
    badge: {
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 6,
    },
    badgeText: {
      fontSize: 9,
      fontFamily: "Inter_600SemiBold",
      letterSpacing: 1.4,
    },
    name: {
      color: p.bone,
      fontSize: 13,
      fontFamily: "Inter_500Medium",
      marginBottom: 3,
      letterSpacing: 0.1,
    },
    muscles: {
      color: p.mutedSoft,
      fontSize: 10,
      fontFamily: "Inter_400Regular",
      letterSpacing: 0.2,
    },
  });
