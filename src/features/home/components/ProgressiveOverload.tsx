import { FontFamilies, Palette } from "@/constants/theme";
import { Feather } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ReAnimated, { FadeInDown } from "react-native-reanimated";
import Svg, { Circle, Defs, LinearGradient as SvgGradient, Path, Rect, Stop } from "react-native-svg";
import {
  useProgressionOverview,
  type BodyPart as ProgressionBodyPart,
  type ExerciseProgress,
} from "../hooks/useProgressionOverview";

type BodyPart = "All" | ProgressionBodyPart;
type StatusFilter = "All" | "Growing" | "Holding" | "Stalled";
type TrendStatus = "growing" | "maintaining" | "stalled";

const STALL_COLOR = "#D88A6A";
const HOLD_COLOR = Palette.muted;

const WEIGHT_GROW = 0.02;
const WEIGHT_STALL = -0.01;
const REPS_GROW = 2;
const REPS_STALL = -2;

function computeTrend(weights: number[], reps: number[]): TrendStatus {
  if (weights.length < 2) return "maintaining";
  const first = weights[0];
  const last = weights[weights.length - 1];
  if (first === 0) return "maintaining";
  const perSessionPct = (last - first) / first / (weights.length - 1);
  if (perSessionPct >= WEIGHT_GROW) return "growing";
  if (perSessionPct <= WEIGHT_STALL) return "stalled";

  // Weight flat — let reps decide.
  const repsDelta = (reps[reps.length - 1] ?? 0) - (reps[0] ?? 0);
  if (repsDelta >= REPS_GROW) return "growing";
  if (repsDelta <= REPS_STALL) return "stalled";
  return "maintaining";
}

function trendPercent(history: number[]): number {
  if (history.length < 2 || history[0] === 0) return 0;
  return ((history[history.length - 1] - history[0]) / history[0]) * 100;
}

const STATUS_COLOR: Record<TrendStatus, string> = {
  growing: Palette.accent,
  maintaining: HOLD_COLOR,
  stalled: STALL_COLOR,
};

const BODY_FILTERS: BodyPart[] = ["Chest", "Back", "Shoulders", "Biceps", "Triceps", "Legs", "Other"];
const PAGE_SIZE = 5;

function StatPill({
  label,
  count,
  color,
  active,
  onPress,
}: {
  label: string;
  count: number;
  color: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.75} style={styles.statPill}>
      <View style={[styles.statDot, { backgroundColor: color, opacity: active ? 1 : 0.45 }]} />
      <Text style={[styles.statCount, { color: active ? Palette.bone : Palette.muted }]}>
        {count.toString().padStart(2, "0")}
      </Text>
      <Text
        style={[
          styles.statLabel,
          { color: active ? color : Palette.mutedSoft },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const SPARK_W = 104;
const SPARK_H = 40;
const BAR_W = 6;

function Sparkline({ history, status }: { history: number[]; status: TrendStatus }) {
  const max = Math.max(...history);
  const min = Math.min(...history);
  const range = max - min || 1;
  const color = STATUS_COLOR[status];

  const slots = history.length;
  const slotW = SPARK_W / slots;
  const xFor = (i: number) => slotW * i + slotW / 2;
  // Floor heights so a flat history still reads as bars.
  const normalized = (v: number) => 0.22 + 0.78 * ((v - min) / range);
  const yFor = (v: number) => SPARK_H - 2 - normalized(v) * (SPARK_H - 8);

  const points = history.map((v, i) => ({ x: xFor(i), y: yFor(v) }));

  const linePath = points
    .map((p, i) => {
      if (i === 0) return `M ${p.x} ${p.y}`;
      const prev = points[i - 1];
      const cx = (prev.x + p.x) / 2;
      return `C ${cx} ${prev.y} ${cx} ${p.y} ${p.x} ${p.y}`;
    })
    .join(" ");

  const last = points[points.length - 1];
  const gradId = `bargrad-${status}`;

  return (
    <Svg width={SPARK_W} height={SPARK_H}>
      <Defs>
        <SvgGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={color} stopOpacity={0.55} />
          <Stop offset="1" stopColor={color} stopOpacity={0.08} />
        </SvgGradient>
      </Defs>

      {history.map((v, i) => {
        const isLast = i === history.length - 1;
        const h = normalized(v) * (SPARK_H - 8);
        const x = xFor(i) - BAR_W / 2;
        const y = SPARK_H - 2 - h;
        return (
          <Rect
            key={i}
            x={x}
            y={y}
            width={BAR_W}
            height={h}
            rx={1.25}
            fill={isLast ? color : `url(#${gradId})`}
            opacity={isLast ? 0.9 : 0.55}
          />
        );
      })}

      <Path
        d={linePath}
        stroke={color}
        strokeWidth={1.3}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.95}
      />
      <Circle cx={last.x} cy={last.y} r={4.5} fill={color} opacity={0.2} />
      <Circle cx={last.x} cy={last.y} r={2.2} fill={color} />
    </Svg>
  );
}

function ExerciseRow({ item, delay }: { item: ExerciseProgress; delay: number }) {
  const status = computeTrend(item.history, item.repsHistory);
  const pct = trendPercent(item.history);
  const color = STATUS_COLOR[status];
  const sign = pct > 0 ? "+" : pct < 0 ? "" : "±";
  const hasHistory = item.history.length > 0;

  return (
    <ReAnimated.View entering={FadeInDown.delay(delay).duration(380)} style={styles.row}>
      <View style={[styles.rail, { backgroundColor: color }]} />

      <View style={styles.rowBody}>
        <View style={styles.rowLeft}>
          <Text style={styles.bodyPartEyebrow}>{item.bodyPart.toUpperCase()}</Text>
          <Text style={styles.exerciseName} numberOfLines={1}>
            {item.name}
          </Text>
          <View style={styles.rowStats}>
            {hasHistory ? (
              <>
                <Text style={styles.weightValue}>{item.currentWeight}</Text>
                <Text style={styles.weightUnit}>{item.unit}</Text>
                <Text style={styles.reps}>×{item.currentReps}</Text>
              </>
            ) : (
              <Text style={styles.reps}>No sessions yet</Text>
            )}
          </View>
        </View>

        <View style={styles.rowRight}>
          {hasHistory ? (
            <>
              <Sparkline history={item.history} status={status} />
              <View style={styles.deltaPill}>
                <Text style={[styles.deltaPct, { color }]}>
                  {sign}
                  {Math.abs(pct).toFixed(1)}%
                </Text>
                <Text style={styles.deltaSessions}>
                  {item.history.length} SESS
                </Text>
              </View>
            </>
          ) : (
            <Text style={styles.deltaSessions}>—</Text>
          )}
        </View>
      </View>
    </ReAnimated.View>
  );
}

export function ProgressiveOverload() {
  const [bodyFilter, setBodyFilter] = useState<BodyPart>("All");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const [page, setPage] = useState(0);
  const { exercises, hasActivePlan } = useProgressionOverview();

  const counts = useMemo(() => {
    return exercises.reduce(
      (acc, e) => {
        const t = computeTrend(e.history, e.repsHistory);
        if (t === "growing") acc.growing++;
        else if (t === "maintaining") acc.holding++;
        else acc.stalled++;
        return acc;
      },
      { growing: 0, holding: 0, stalled: 0 }
    );
  }, [exercises]);

  const filtered = useMemo(() => {
    return exercises.filter((e) => {
      if (bodyFilter !== "All" && e.bodyPart !== bodyFilter) return false;
      if (statusFilter === "All") return true;
      const t = computeTrend(e.history, e.repsHistory);
      if (statusFilter === "Growing") return t === "growing";
      if (statusFilter === "Holding") return t === "maintaining";
      return t === "stalled";
    });
  }, [exercises, bodyFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  const setBody = (f: BodyPart) => {
    setBodyFilter(f);
    setPage(0);
  };
  const toggleStatus = (s: StatusFilter) => {
    setStatusFilter((prev) => (prev === s ? "All" : s));
    setPage(0);
  };

  return (
    <ReAnimated.View entering={FadeInDown.delay(390).duration(400)} style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Progression · Last 6 sessions</Text>
        <Text style={styles.title}>Are you growing?</Text>
      </View>

      <View style={styles.statRow}>
        <StatPill
          label="GROWING"
          count={counts.growing}
          color={Palette.accent}
          active={statusFilter === "All" || statusFilter === "Growing"}
          onPress={() => toggleStatus("Growing")}
        />
        <View style={styles.statDivider} />
        <StatPill
          label="HOLDING"
          count={counts.holding}
          color={HOLD_COLOR}
          active={statusFilter === "All" || statusFilter === "Holding"}
          onPress={() => toggleStatus("Holding")}
        />
        <View style={styles.statDivider} />
        <StatPill
          label="STALLED"
          count={counts.stalled}
          color={STALL_COLOR}
          active={statusFilter === "All" || statusFilter === "Stalled"}
          onPress={() => toggleStatus("Stalled")}
        />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipRow}
      >
        {BODY_FILTERS.map((f) => {
          const selected = bodyFilter === f;
          return (
            <TouchableOpacity
              key={f}
              onPress={() => setBody(f)}
              activeOpacity={0.7}
              hitSlop={6}
              style={styles.chip}
            >
              <Text
                style={[
                  styles.chipText,
                  {
                    color: selected ? Palette.accent : Palette.muted,
                    fontFamily: selected ? FontFamilies.medium : FontFamilies.regular,
                  },
                ]}
              >
                {f}
              </Text>
              {selected && <View style={styles.chipUnderline} />}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={styles.list}>
        {!hasActivePlan ? (
          <View style={styles.empty}>
            <Feather name="inbox" size={14} color={Palette.muted} />
            <Text style={styles.emptyText}>Set an active plan to track progression</Text>
          </View>
        ) : paginated.length === 0 ? (
          <View style={styles.empty}>
            <Feather name="inbox" size={14} color={Palette.muted} />
            <Text style={styles.emptyText}>
              {exercises.length === 0
                ? "No exercises in your active plan yet"
                : "Nothing matches that filter"}
            </Text>
          </View>
        ) : (
          paginated.map((item, i) => <ExerciseRow key={item.name} item={item} delay={i * 50} />)
        )}
      </View>

      {totalPages > 1 && (
        <View style={styles.pagination}>
          <TouchableOpacity
            onPress={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            activeOpacity={0.7}
            style={[styles.pageBtn, page === 0 && { opacity: 0.3 }]}
          >
            <Feather name="arrow-left" size={12} color={Palette.accent} />
            <Text style={styles.pageBtnText}>Prev</Text>
          </TouchableOpacity>

          <Text style={styles.pageIndex}>
            {String(page + 1).padStart(2, "0")} / {String(totalPages).padStart(2, "0")}
          </Text>

          <TouchableOpacity
            onPress={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page === totalPages - 1}
            activeOpacity={0.7}
            style={[styles.pageBtn, page === totalPages - 1 && { opacity: 0.3 }]}
          >
            <Text style={styles.pageBtnText}>Next</Text>
            <Feather name="arrow-right" size={12} color={Palette.accent} />
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
    paddingVertical: 22,
  },
  header: {
    paddingHorizontal: 22,
    marginBottom: 18,
  },
  eyebrow: {
    color: Palette.muted,
    fontSize: 9,
    fontFamily: FontFamilies.medium,
    letterSpacing: 2.2,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  title: {
    color: Palette.bone,
    fontSize: 22,
    fontFamily: FontFamilies.displayMedium,
    letterSpacing: -0.5,
  },

  statRow: {
    flexDirection: "row",
    alignItems: "stretch",
    marginHorizontal: 22,
    paddingVertical: 14,
    paddingHorizontal: 4,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Palette.hairlineStrong,
    backgroundColor: "rgba(255,255,255,0.015)",
    marginBottom: 18,
  },
  statPill: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 2,
    gap: 6,
  },
  statDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  statCount: {
    fontSize: 22,
    fontFamily: FontFamilies.displayMedium,
    letterSpacing: -1,
    fontVariant: ["tabular-nums"],
    lineHeight: 24,
  },
  statLabel: {
    fontSize: 9,
    fontFamily: FontFamilies.medium,
    letterSpacing: 1.8,
  },
  statDivider: {
    width: StyleSheet.hairlineWidth,
    backgroundColor: Palette.hairlineStrong,
    marginVertical: 6,
  },

  chipRow: {
    paddingHorizontal: 22,
    gap: 18,
    paddingBottom: 14,
  },
  chip: { alignItems: "center", paddingVertical: 4 },
  chipText: {
    fontSize: 10,
    letterSpacing: 1.6,
    textTransform: "uppercase",
  },
  chipUnderline: {
    height: 1,
    width: 14,
    backgroundColor: Palette.accent,
    marginTop: 6,
  },

  list: { paddingHorizontal: 22 },
  row: {
    flexDirection: "row",
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Palette.hairline,
    gap: 12,
  },
  rail: {
    width: 2,
    borderRadius: 1,
    alignSelf: "stretch",
    opacity: 0.85,
  },
  rowBody: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 14,
  },
  rowLeft: {
    flex: 1,
  },
  bodyPartEyebrow: {
    color: Palette.mutedSoft,
    fontSize: 8.5,
    fontFamily: FontFamilies.medium,
    letterSpacing: 1.8,
    marginBottom: 4,
  },
  exerciseName: {
    color: Palette.bone,
    fontSize: 15,
    fontFamily: FontFamilies.displayMedium,
    letterSpacing: -0.3,
    marginBottom: 6,
  },
  rowStats: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 3,
  },
  weightValue: {
    color: Palette.bone,
    fontSize: 16,
    fontFamily: FontFamilies.displayMedium,
    letterSpacing: -0.4,
    fontVariant: ["tabular-nums"],
  },
  weightUnit: {
    color: Palette.muted,
    fontSize: 10,
    fontFamily: FontFamilies.regular,
    marginLeft: 1,
  },
  reps: {
    color: Palette.muted,
    fontSize: 11,
    fontFamily: FontFamilies.regular,
    fontVariant: ["tabular-nums"],
    marginLeft: 6,
  },

  rowRight: {
    alignItems: "flex-end",
    gap: 4,
  },
  deltaPill: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 6,
  },
  deltaPct: {
    fontSize: 11,
    fontFamily: FontFamilies.medium,
    letterSpacing: 0.3,
    fontVariant: ["tabular-nums"],
  },
  deltaSessions: {
    color: Palette.mutedSoft,
    fontSize: 8.5,
    fontFamily: FontFamilies.medium,
    letterSpacing: 1.4,
  },

  empty: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 32,
    gap: 8,
  },
  emptyText: {
    color: Palette.muted,
    fontSize: 11,
    fontFamily: FontFamilies.regular,
    letterSpacing: 0.4,
  },

  pagination: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 22,
    paddingTop: 16,
  },
  pageBtn: { flexDirection: "row", alignItems: "center", gap: 6 },
  pageBtnText: {
    color: Palette.accent,
    fontSize: 10,
    fontFamily: FontFamilies.medium,
    letterSpacing: 1.6,
    textTransform: "uppercase",
  },
  pageIndex: {
    color: Palette.muted,
    fontSize: 10,
    fontFamily: FontFamilies.medium,
    letterSpacing: 2,
    fontVariant: ["tabular-nums"],
  },
});
