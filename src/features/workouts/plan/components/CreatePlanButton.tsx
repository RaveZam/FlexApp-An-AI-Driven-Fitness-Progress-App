import ActionButton from "@/components/ui/ActionButton";
import { useRouter } from "expo-router";
import { StyleSheet } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

export function CreatePlanButton() {
  const router = useRouter();

  return (
    <Animated.View
      entering={FadeIn.delay(360).duration(420)}
      style={styles.ctaWrap}
    >
      <ActionButton
        title="Create Plan"
        onPress={() => router.push("/(tabs)/Workouts/create-plan")}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  ctaWrap: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 14 },
});
