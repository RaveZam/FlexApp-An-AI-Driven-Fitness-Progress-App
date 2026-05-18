import { FontFamilies, Palette } from "@/constants/theme";
import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ReAnimated, { FadeInDown } from "react-native-reanimated";

type BodyPart = "All" | "Chest" | "Back" | "Shoulders" | "Biceps" | "Triceps" | "Legs";

interface ExerciseProgress {
  name: string;
  bodyPart: Exclude<BodyPart, "All">;
  currentWeight: number;
  currentReps: number;
  unit: "kg" | "lbs";
  deltaWeight: number;
  deltaReps: number;
  progress: number;
}

const EXERCISES: ExerciseProgress[] = [
  { name: "Bench Press",      bodyPart: "Chest",     currentWeight: 95,    currentReps: 8,  unit: "kg", deltaWeight: 7.5, deltaReps: 1,  progress: 0.72 },
  { name: "Incline Dumbbell", bodyPart: "Chest",     currentWeight: 34,    currentReps: 10, unit: "kg", deltaWeight: 4,   deltaReps: 2,  progress: 0.61 },
  { name: "Squat",            bodyPart: "Legs",      currentWeight: 120,   currentReps: 5,  unit: "kg", deltaWeight: 5,   deltaReps: 0,  progress: 0.80 },
  { name: "Leg Press",        bodyPart: "Legs",      currentWeight: 200,   currentReps: 12, unit: "kg", deltaWeight: 10,  deltaReps: 2,  progress: 0.68 },
  { name: "Deadlift",         bodyPart: "Back",      currentWeight: 152.5, currentReps: 5,  unit: "kg", deltaWeight: 10,  deltaReps: 0,  progress: 0.85 },
  { name: "Barbell Row",      bodyPart: "Back",      currentWeight: 80,    currentReps: 8,  unit: "kg", deltaWeight: 5,   deltaReps: 1,  progress: 0.70 },
  { name: "Lat Pulldown",     bodyPart: "Back",      currentWeight: 72.5,  currentReps: 10, unit: "kg", deltaWeight: 2.5, deltaReps: 2,  progress: 0.58 },
  { name: "Overhead Press",   bodyPart: "Shoulders", currentWeight: 60,    currentReps: 6,  unit: "kg", deltaWeight: 2.5, deltaReps: 1,  progress: 0.65 },
  { name: "Lateral Raise",    bodyPart: "Shoulders", currentWeight: 14,    currentReps: 15, unit: "kg", deltaWeight: 2,   deltaReps: 3,  progress: 0.55 },
  { name: "Face Pull",        bodyPart: "Shoulders", currentWeight: 37.5,  currentReps: 12, unit: "kg", deltaWeight: 5,   deltaReps: 0,  progress: 0.60 },
  { name: "Barbell Curl",     bodyPart: "Biceps",    currentWeight: 40,    currentReps: 10, unit: "kg", deltaWeight: 5,   deltaReps: 2,  progress: 0.74 },
  { name: "Hammer Curl",      bodyPart: "Biceps",    currentWeight: 18,    currentReps: 12, unit: "kg", deltaWeight: 2,   deltaReps: 2,  progress: 0.62 },
  { name: "Tricep Pushdown",  bodyPart: "Triceps",   currentWeight: 50,    currentReps: 12, unit: "kg", deltaWeight: 5,   deltaReps: 2,  progress: 0.69 },
  { name: "Skull Crushers",   bodyPart: "Triceps",   currentWeight: 30,    currentReps: 10, unit: "kg", deltaWeight: 2.5, deltaReps: 1,  progress: 0.57 },
];

const FILTERS: BodyPart[] = ["All", "Chest", "Back", "Shoulders", "Biceps", "Triceps", "Legs"];
const PAGE_SIZE = 5;

function FilterChip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} hitSlop={6} style={styles.chip}>
      <Text
        style={[
          styles.chipText,
          {
            color: selected ? Palette.accent : Palette.muted,
            fontFamily: selected ? FontFamilies.medium : FontFamilies.regular,
          },
        ]}
      >
        {label}
      </Text>
      {selected && <View style={styles.chipUnderline} />}
    </TouchableOpacity>
  );
}

function ExerciseRow({ item, delay }: { item: ExerciseProgress; delay: number }) {
  return (
    <ReAnimated.View entering={FadeInDown.delay(delay).duration(400)} style={styles.exerciseRow}>
      <View style={styles.exerciseTop}>
        <View style={{ flex: 1, paddingRight: 12 }}>
          <Text style={styles.exerciseName}>{item.name}</Text>
          <Text style={styles.exerciseMeta}>{item.bodyPart.toUpperCase()}</Text>
        </View>

        <View style={{ alignItems: "flex-end" }}>
          <View style={styles.weightRow}>
            <Text style={styles.weightValue}>{item.currentWeight}</Text>
            <Text style={styles.weightUnit}>{item.unit}</Text>
            <Text style={styles.weightReps}>× {item.currentReps}</Text>
          </View>
          <View style={styles.deltaRow}>
            <Text style={styles.deltaText}>
              +{item.deltaWeight}
              <Text style={styles.deltaUnit}> {item.unit}</Text>
            </Text>
            {item.deltaReps > 0 && (
              <>
                <View style={styles.deltaDot} />
                <Text style={styles.deltaText}>
                  +{item.deltaReps}
                  <Text style={styles.deltaUnit}> rep{item.deltaReps > 1 ? "s" : ""}</Text>
                </Text>
              </>
            )}
          </View>
        </View>
      </View>

      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${item.progress * 100}%` }]} />
      </View>
    </ReAnimated.View>
  );
}

export function ProgressiveOverload() {
  const [activeFilter, setActiveFilter] = useState<BodyPart>("All");
  const [page, setPage] = useState(0);

  const filtered =
    activeFilter === "All" ? EXERCISES : EXERCISES.filter((e) => e.bodyPart === activeFilter);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  const handleFilterChange = (f: BodyPart) => {
    setActiveFilter(f);
    setPage(0);
  };

  return (
    <ReAnimated.View entering={FadeInDown.delay(390).duration(400)} style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>Compared to last session</Text>
          <Text style={styles.title}>Progressive Overload</Text>
        </View>
        <View style={styles.trendChip}>
          <Feather name="trending-up" size={11} color={Palette.accent} />
          <Text style={styles.trendText}>Trending up</Text>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipRow}
      >
        {FILTERS.map((f) => (
          <FilterChip
            key={f}
            label={f}
            selected={activeFilter === f}
            onPress={() => handleFilterChange(f)}
          />
        ))}
      </ScrollView>

      <View style={styles.divider} />

      <View style={styles.list}>
        {paginated.map((item, index) => (
          <ExerciseRow key={item.name} item={item} delay={index * 40} />
        ))}
      </View>

      {totalPages > 1 && (
        <View style={styles.pagination}>
          <TouchableOpacity
            onPress={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            activeOpacity={0.7}
            style={[styles.pageBtn, page === 0 && { opacity: 0.3 }]}
          >
            <Feather name="chevron-left" size={13} color={Palette.accent} />
            <Text style={styles.pageBtnText}>Prev</Text>
          </TouchableOpacity>

          <View style={styles.dots}>
            {Array.from({ length: totalPages }).map((_, i) => (
              <TouchableOpacity key={i} onPress={() => setPage(i)} activeOpacity={0.7} hitSlop={6}>
                <View
                  style={{
                    width: i === page ? 14 : 4,
                    height: 4,
                    borderRadius: 2,
                    backgroundColor: i === page ? Palette.accent : Palette.hairlineStrong,
                  }}
                />
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            onPress={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page === totalPages - 1}
            activeOpacity={0.7}
            style={[styles.pageBtn, page === totalPages - 1 && { opacity: 0.3 }]}
          >
            <Text style={styles.pageBtnText}>Next</Text>
            <Feather name="chevron-right" size={13} color={Palette.accent} />
          </TouchableOpacity>
        </View>
      )}
    </ReAnimated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 20,
    borderRadius: 18,
    backgroundColor: Palette.inkSunken,
    overflow: "hidden",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Palette.hairline,
    paddingVertical: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  eyebrow: {
    color: Palette.muted,
    fontSize: 9,
    fontFamily: FontFamilies.medium,
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  title: {
    color: Palette.bone,
    fontSize: 18,
    fontFamily: FontFamilies.displayMedium,
    letterSpacing: -0.3,
  },
  trendChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Palette.accentBorderSoft,
  },
  trendText: {
    color: Palette.accent,
    fontSize: 10,
    fontFamily: FontFamilies.medium,
    letterSpacing: 0.5,
  },
  chipRow: { paddingHorizontal: 20, gap: 18, paddingBottom: 14 },
  chip: { alignItems: "center", paddingVertical: 4 },
  chipText: {
    fontSize: 11,
    letterSpacing: 1.6,
    textTransform: "uppercase",
  },
  chipUnderline: {
    height: 1,
    width: 16,
    backgroundColor: Palette.accent,
    marginTop: 6,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Palette.hairline,
    marginHorizontal: 20,
  },
  list: { paddingHorizontal: 20 },
  exerciseRow: {
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Palette.hairline,
  },
  exerciseTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  exerciseName: {
    color: Palette.bone,
    fontSize: 14,
    fontFamily: FontFamilies.displayMedium,
    letterSpacing: -0.2,
    marginBottom: 4,
  },
  exerciseMeta: {
    color: Palette.mutedSoft,
    fontSize: 9,
    fontFamily: FontFamilies.medium,
    letterSpacing: 1.6,
  },
  weightRow: { flexDirection: "row", alignItems: "baseline", gap: 4 },
  weightValue: {
    color: Palette.bone,
    fontSize: 18,
    fontFamily: FontFamilies.displayMedium,
    letterSpacing: -0.4,
    fontVariant: ["tabular-nums"],
  },
  weightUnit: {
    color: Palette.muted,
    fontSize: 11,
    fontFamily: FontFamilies.regular,
  },
  weightReps: {
    color: Palette.muted,
    fontSize: 12,
    fontFamily: FontFamilies.regular,
    marginLeft: 4,
    fontVariant: ["tabular-nums"],
  },
  deltaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 4,
  },
  deltaText: {
    color: Palette.accent,
    fontSize: 10,
    fontFamily: FontFamilies.medium,
    letterSpacing: 0.4,
    fontVariant: ["tabular-nums"],
  },
  deltaUnit: { color: Palette.muted, fontFamily: FontFamilies.regular },
  deltaDot: {
    width: 2,
    height: 2,
    borderRadius: 1,
    backgroundColor: Palette.mutedSoft,
  },
  progressTrack: {
    height: 1,
    backgroundColor: Palette.hairline,
    overflow: "hidden",
  },
  progressFill: { height: "100%", backgroundColor: Palette.accent },
  pagination: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  pageBtn: { flexDirection: "row", alignItems: "center", gap: 5 },
  pageBtnText: {
    color: Palette.accent,
    fontSize: 10,
    fontFamily: FontFamilies.medium,
    letterSpacing: 1.6,
    textTransform: "uppercase",
  },
  dots: { flexDirection: "row", gap: 5, alignItems: "center" },
});
