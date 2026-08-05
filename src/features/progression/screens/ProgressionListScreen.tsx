import { usePalette, type Palette } from "@/src/theme";
import { SectionLabel } from "@/src/features/home/components/SectionLabel";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MuscleFilterChips } from "../components/MuscleFilterChips";
import { ProgressionRow } from "../components/ProgressionRow";
import { progressionMock } from "../mock/progressionMock";

const ALL = "All";

export default function ProgressionListScreen() {
  const p = usePalette();
  const styles = useMemo(() => makeStyles(p), [p]);
  const router = useRouter();
  const [selected, setSelected] = useState(ALL);

  const groups = useMemo(
    () => [ALL, ...Array.from(new Set(progressionMock.map((e) => e.muscleGroup)))],
    [],
  );

  const exercises = useMemo(
    () =>
      selected === ALL
        ? progressionMock
        : progressionMock.filter((e) => e.muscleGroup === selected),
    [selected],
  );

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <LinearGradient
        colors={[p.accentSoft, "transparent"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 0.35 }}
        style={StyleSheet.absoluteFillObject}
        pointerEvents="none"
      />

      <View style={styles.container}>
        <SectionLabel eyebrow="Progression" title="Progress" />

        <View style={styles.chipsWrap}>
          <MuscleFilterChips groups={groups} selected={selected} onSelect={setSelected} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={{ gap: 10 }}>
            {exercises.map((exercise, i) => (
              <ProgressionRow
                key={exercise.id}
                exercise={exercise}
                delay={i * 60}
                onPress={() => router.push(`/Overview/${exercise.id}`)}
              />
            ))}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const makeStyles = (p: Palette) =>
  StyleSheet.create({
  safe: { flex: 1, backgroundColor: p.ink },
  container: { flex: 1, backgroundColor: "transparent" },
  chipsWrap: { paddingHorizontal: 20, marginBottom: 6 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 32 },
});
