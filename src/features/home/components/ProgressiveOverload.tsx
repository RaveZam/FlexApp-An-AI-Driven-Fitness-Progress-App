import { FontFamilies, Palette } from "@/constants/theme";
import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ReAnimated, { FadeInDown } from "react-native-reanimated";
import Svg, { Circle, Polyline } from "react-native-svg";

type BodyPart = "All" | "Chest" | "Back" | "Shoulders" | "Biceps" | "Triceps" | "Legs";

type TrendStatus = "growing" | "maintaining" | "stalled";

interface ExerciseProgress {
  name: string;
  bodyPart: Exclude<BodyPart, "All">;
  currentWeight: number;
  currentReps: number;
  unit: "kg" | "lbs";
  deltaWeight: number;
  deltaReps: number;
  history: number[]; // last 6 session top-set weights (oldest → newest)
}

const EXERCISES: ExerciseProgress[] = [
  { name: "Bench Press",      bodyPart: "Chest",     currentWeight: 95,    currentReps: 8,  unit: "kg", deltaWeight: 7.5, deltaReps: 1, history: [80, 82.5, 85, 87.5, 90, 95] },
  { name: "Incline Dumbbell", bodyPart: "Chest",     currentWeight: 34,    currentReps: 10, unit: "kg", deltaWeight: 4,   deltaReps: 2, history: [28, 30, 30, 32, 32, 34] },
  { name: "Squat",            bodyPart: "Legs",      currentWeight: 120,   currentReps: 5,  unit: "kg", deltaWeight: 5,   deltaReps: 0, history: [105, 110, 112.5, 115, 117.5, 120] },
  { name: "Leg Press",        bodyPart: "Legs",      currentWeight: 200,   currentReps: 12, unit: "kg", deltaWeight: 10,  deltaReps: 2, history: [170, 180, 185, 190, 195, 200] },
  { name: "Deadlift",         bodyPart: "Back",      currentWeight: 152.5, currentReps: 5,  unit: "kg", deltaWeight: 10,  deltaReps: 0, history: [130, 137.5, 140, 145, 150, 152.5] },
  { name: "Barbell Row",      bodyPart: "Back",      currentWeight: 80,    currentReps: 8,  unit: "kg", deltaWeight: 5,   deltaReps: 1, history: [70, 72.5, 75, 75, 77.5, 80] },
  { name: "Lat Pulldown",     bodyPart: "Back",      currentWeight: 72.5,  currentReps: 10, unit: "kg", deltaWeight: 2.5, deltaReps: 2, history: [70, 70, 72.5, 70, 72.5, 72.5] },
  { name: "Overhead Press",   bodyPart: "Shoulders", currentWeight: 60,    currentReps: 6,  unit: "kg", deltaWeight: 2.5, deltaReps: 1, history: [55, 55, 57.5, 57.5, 60, 60] },
  { name: "Lateral Raise",    bodyPart: "Shoulders", currentWeight: 14,    currentReps: 15, unit: "kg", deltaWeight: 2,   deltaReps: 3, history: [12, 12, 14, 12, 14, 14] },
  { name: "Face Pull",        bodyPart: "Shoulders", currentWeight: 37.5,  currentReps: 12, unit: "kg", deltaWeight: 5,   deltaReps: 0, history: [35, 37.5, 37.5, 35, 37.5, 37.5] },
  { name: "Barbell Curl",     bodyPart: "Biceps",    currentWeight: 40,    currentReps: 10, unit: "kg", deltaWeight: 5,   deltaReps: 2, history: [32.5, 35, 35, 37.5, 40, 40] },
  { name: "Hammer Curl",      bodyPart: "Biceps",    currentWeight: 18,    currentReps: 12, unit: "kg", deltaWeight: 2,   deltaReps: 2, history: [16, 16, 18, 18, 16, 18] },
  { name: "Tricep Pushdown",  bodyPart: "Triceps",   currentWeight: 50,    currentReps: 12, unit: "kg", deltaWeight: 5,   deltaReps: 2, history: [42.5, 45, 45, 47.5, 50, 50] },
  { name: "Skull Crushers",   bodyPart: "Triceps",   currentWeight: 30,    currentReps: 10, unit: "kg", deltaWeight: 2.5, deltaReps: 1, history: [30, 28, 30, 28, 30, 30] },
];

function computeTrend(history: number[]): TrendStatus {
  if (history.length < 2) return "maintaining";
  const first = history[0];
  const last = history[history.length - 1];
  if (first === 0) return "maintaining";
  const pctChange = (last - first) / first;
  // Average per-session change to normalize across history lengths.
  const perSession = pctChange / (history.length - 1);
  if (perSession >= 0.02) return "growing";
  if (perSession <= -0.01) return "stalled";
  return "maintaining";
}

const TREND_META: Record<TrendStatus, { label: string; icon: "trending-up" | "minus" | "trending-down"; color: string; bg: string }> = {
  growing:     { label: "Growing",     icon: "trending-up",   color: Palette.accent,    bg: "rgba(180, 220, 80, 0.10)" },
  maintaining: { label: "Maintaining", icon: "minus",         color: Palette.muted,     bg: "rgba(255, 255, 255, 0.04)" },
  stalled:     { label: "Stalled",     icon: "trending-down", color: "#D88A6A",         bg: "rgba(216, 138, 106, 0.10)" },
};

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

function TrendBadge({ status }: { status: TrendStatus }) {
  const meta = TREND_META[status];
  return (
    <View style={[styles.trendBadge, { backgroundColor: meta.bg }]}>
      <Feather name={meta.icon} size={9} color={meta.color} />
      <Text style={[styles.trendBadgeText, { color: meta.color }]}>{meta.label}</Text>
    </View>
  );
}

const BAR_WIDTH = 4;
const BAR_GAP = 6;
const CHART_HEIGHT = 22;

function MiniBars({ history, status }: { history: number[]; status: TrendStatus }) {
  const max = Math.max(...history);
  const min = Math.min(...history);
  const range = max - min || 1;
  const barColor = status === "stalled" ? "#D88A6A" : status === "growing" ? Palette.accent : Palette.muted;
  const lineColor = barColor;

  const chartWidth = history.length * BAR_WIDTH + (history.length - 1) * BAR_GAP;
  // Floor at 25% so flat history still reads as bars.
  const heightFor = (v: number) => 0.25 + (0.75 * (v - min)) / range;
  const points = history
    .map((v, i) => {
      const x = i * (BAR_WIDTH + BAR_GAP) + BAR_WIDTH / 2;
      const y = CHART_HEIGHT - heightFor(v) * CHART_HEIGHT;
      return `${x},${y}`;
    })
    .join(" ");
  const lastX = (history.length - 1) * (BAR_WIDTH + BAR_GAP) + BAR_WIDTH / 2;
  const lastY = CHART_HEIGHT - heightFor(history[history.length - 1]) * CHART_HEIGHT;

  return (
    <View style={[styles.miniBars, { width: chartWidth, height: CHART_HEIGHT }]}>
      {history.map((v, i) => {
        const isLast = i === history.length - 1;
        return (
          <View
            key={i}
            style={{
              width: BAR_WIDTH,
              height: `${heightFor(v) * 100}%`,
              borderRadius: 1,
              backgroundColor: barColor,
              opacity: isLast ? 0.55 : 0.2 + (i / history.length) * 0.25,
            }}
          />
        );
      })}
      <Svg
        width={chartWidth}
        height={CHART_HEIGHT}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      >
        <Polyline
          points={points}
          fill="none"
          stroke={lineColor}
          strokeWidth={1.25}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Circle cx={lastX} cy={lastY} r={2} fill={lineColor} />
      </Svg>
    </View>
  );
}

function ExerciseRow({ item, delay }: { item: ExerciseProgress; delay: number }) {
  const status = computeTrend(item.history);
  return (
    <ReAnimated.View entering={FadeInDown.delay(delay).duration(400)} style={styles.exerciseRow}>
      <View style={styles.exerciseTop}>
        <View style={{ flex: 1, paddingRight: 12 }}>
          <Text style={styles.exerciseName}>{item.name}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.exerciseMeta}>{item.bodyPart.toUpperCase()}</Text>
            <View style={styles.metaDot} />
            <TrendBadge status={status} />
          </View>
        </View>

        <View style={{ alignItems: "flex-end" }}>
          <View style={styles.weightRow}>
            <Text style={styles.weightValue}>{item.currentWeight}</Text>
            <Text style={styles.weightUnit}>{item.unit}</Text>
            <Text style={styles.weightReps}>× {item.currentReps}</Text>
          </View>
          <View style={styles.deltaRow}>
            <Text style={[styles.deltaText, status === "stalled" && { color: Palette.muted }]}>
              {item.deltaWeight > 0 ? "+" : ""}
              {item.deltaWeight}
              <Text style={styles.deltaUnit}> {item.unit}</Text>
            </Text>
            {item.deltaReps > 0 && (
              <>
                <View style={styles.deltaDot} />
                <Text style={[styles.deltaText, status === "stalled" && { color: Palette.muted }]}>
                  +{item.deltaReps}
                  <Text style={styles.deltaUnit}> rep{item.deltaReps > 1 ? "s" : ""}</Text>
                </Text>
              </>
            )}
          </View>
        </View>
      </View>

      <View style={styles.historyRow}>
        <MiniBars history={item.history} status={status} />
        <Text style={styles.historyLabel}>Last {item.history.length} sessions</Text>
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
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 2,
  },
  metaDot: {
    width: 2,
    height: 2,
    borderRadius: 1,
    backgroundColor: Palette.mutedSoft,
  },
  trendBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  trendBadgeText: {
    fontSize: 9,
    fontFamily: FontFamilies.medium,
    letterSpacing: 0.6,
  },
  historyRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginTop: 4,
  },
  miniBars: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: BAR_GAP,
    position: "relative",
  },
  historyLabel: {
    color: Palette.mutedSoft,
    fontSize: 9,
    fontFamily: FontFamilies.regular,
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
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
