import { usePalette, type Palette } from "@/src/theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useMemo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";

export function TemplatesHeader() {
  const p = usePalette();
  const styles = useMemo(() => makeStyles(p), [p]);
  const router = useRouter();

  const opacity = useSharedValue(0);
  const translateY = useSharedValue(-10);

  useEffect(() => {
    opacity.value = withDelay(50, withTiming(1, { duration: 400 }));
    translateY.value = withDelay(
      50,
      withSpring(0, { damping: 20, stiffness: 200 })
    );
  }, []);

  const entrance = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[styles.header, entrance]}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => router.back()}
        style={styles.backButton}
      >
        <Ionicons name="chevron-back" size={20} color={p.bone} />
      </TouchableOpacity>

      <View>
        <Text style={styles.title}>Templates</Text>
        <Text style={styles.subtitle}>Pick a split to get started</Text>
      </View>
    </Animated.View>
  );
}

const makeStyles = (p: Palette) =>
  StyleSheet.create({
    header: {
      paddingHorizontal: 20,
      paddingTop: 8,
      paddingBottom: 16,
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    backButton: {
      width: 38,
      height: 38,
      borderRadius: 10,
      backgroundColor: p.inkRaised,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: p.hairline,
    },
    title: {
      color: p.bone,
      fontSize: 20,
      fontFamily: "Inter_600SemiBold",
      letterSpacing: -0.2,
    },
    subtitle: {
      color: p.mutedSoft,
      fontSize: 12,
      fontFamily: "Inter_400Regular",
      marginTop: 2,
      letterSpacing: 0.2,
    },
  });
