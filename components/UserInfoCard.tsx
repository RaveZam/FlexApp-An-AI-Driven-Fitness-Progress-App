import { FontFamilies, Palette } from "@/constants/theme";
import Fontisto from "@expo/vector-icons/Fontisto";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";

export default function UserInfoCard() {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(-8);

  useEffect(() => {
    opacity.value = withDelay(30, withTiming(1, { duration: 350 }));
    translateY.value = withDelay(30, withSpring(0, { damping: 22, stiffness: 220 }));
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[styles.row, animatedStyle]}>
      <View style={styles.brand}>
        <Ionicons name="barbell" size={32} color="#FFFFFF" />
        <View>
          <Text style={styles.wordmark}>
            Flex<Text style={styles.wordmarkAccent}>Life</Text>
          </Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity activeOpacity={0.7} style={styles.iconBtn}>
          <Fontisto name="bell" size={14} color={Palette.muted} />
        </TouchableOpacity>

        <Image
          style={styles.avatar}
          source={{
            uri: "https://res.cloudinary.com/dcdgu2fxc/image/upload/v1755494500/pfp_l6k1di.jpg",
          }}
        />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: "transparent",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Palette.hairline,
  },
  brand: { flexDirection: "row", alignItems: "center", gap: 12 },
  eyebrow: {
    color: Palette.accent,
    fontSize: 8,
    fontFamily: FontFamilies.medium,
    letterSpacing: 2.4,
    textTransform: "uppercase",
    marginBottom: 2,
  },
  wordmark: {
    color: Palette.bone,
    fontSize: 20,
    fontFamily: FontFamilies.displayMedium,
    letterSpacing: -0.4,
  },
  wordmarkAccent: { color: Palette.accent, fontFamily: FontFamilies.displayLight },
  actions: { marginLeft: "auto", flexDirection: "row", gap: 10, alignItems: "center" },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Palette.inkRaised,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Palette.hairlineStrong,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Palette.accentBorder,
  },
});
