import { FontFamilies, Palette } from "@/constants/theme";
import { StyleSheet, Text } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

type Props = {
  eyebrow?: string;
  title: string;
  delay?: number;
};

export function SectionLabel({ eyebrow, title, delay = 0 }: Props) {
  return (
    <Animated.View entering={FadeInDown.delay(delay).duration(400)} style={styles.sectionHead}>
      {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
      <Text style={styles.sectionTitle}>{title}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  sectionHead: {
    paddingHorizontal: 20,
    marginTop: 18,
    marginBottom: 12,
  },
  eyebrow: {
    color: Palette.accent,
    fontSize: 9,
    fontFamily: FontFamilies.medium,
    letterSpacing: 2.4,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  sectionTitle: {
    color: Palette.bone,
    fontSize: 22,
    fontFamily: FontFamilies.displayMedium,
    letterSpacing: -0.4,
  },
});
