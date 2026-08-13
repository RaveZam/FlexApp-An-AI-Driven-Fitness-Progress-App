import "@/global.css";
import { usePalette, type Palette } from "@/src/theme";
import { useMemo } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { CreateCustomWorkoutCard } from "../components/CreateCustomWorkoutCard";
import { TemplateCard } from "../components/TemplateCard";
import { TemplatesHeader } from "../components/TemplatesHeader";
import { TEMPLATE_SPLITS } from "../core/templateSplits";

export default function WorkoutTemplatesScreen() {
  const p = usePalette();
  const styles = useMemo(() => makeStyles(p), [p]);

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.container}>
        <TemplatesHeader />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.section}>
            <Animated.View
              entering={FadeInDown.delay(60).duration(400)}
              style={styles.grid}
            >
              {TEMPLATE_SPLITS.map((template, index) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  index={index}
                />
              ))}
            </Animated.View>
          </View>

          <View style={styles.divider} />

          <View style={styles.section}>
            <CreateCustomWorkoutCard />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const makeStyles = (p: Palette) =>
  StyleSheet.create({
    safe: { flex: 1, backgroundColor: p.ink },
    container: { flex: 1, backgroundColor: p.ink },
    scrollContent: { paddingBottom: 32 },
    section: { paddingHorizontal: 20 },
    grid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
    divider: {
      marginHorizontal: 20,
      marginVertical: 24,
      height: 1,
      backgroundColor: p.hairline,
    },
  });
