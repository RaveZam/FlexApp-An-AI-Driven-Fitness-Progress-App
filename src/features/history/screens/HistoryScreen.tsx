import { FontFamilies, Palette } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  SectionList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSessionHistory } from "../hooks/useSessionHistory";
import type { WorkoutSessionSummary } from "../types";

const DAY_ABBR = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const MONTH_ABBR = [
  "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
  "JUL", "AUG", "SEP", "OCT", "NOV", "DEC",
];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function formatDuration(startedAt: string, completedAt: string): string {
  const ms = new Date(completedAt).getTime() - new Date(startedAt).getTime();
  const totalMin = Math.round(ms / 60000);
  if (totalMin < 60) return `${totalMin}m`;
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

function formatVolume(lb: number): string {
  if (lb <= 0) return "—";
  if (lb < 1000) return `${Math.round(lb)}`;
  const k = lb / 1000;
  return `${k >= 10 ? Math.round(k) : k.toFixed(1).replace(/\.0$/, "")}k`;
}

function dayKey(d: Date): string {
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

// Consecutive calendar days ending today (one grace day for "yesterday").
function computeDayStreak(dates: Date[]): number {
  const keys = new Set(dates.map(dayKey));
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);
  if (!keys.has(dayKey(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
    if (!keys.has(dayKey(cursor))) return 0;
  }
  let streak = 0;
  while (keys.has(dayKey(cursor))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

function OverviewCard({ sessions }: { sessions: WorkoutSessionSummary[] }) {
  const stats = useMemo(() => {
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setHours(0, 0, 0, 0);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    let thisWeek = 0;
    let monthVolume = 0;
    for (const s of sessions) {
      const d = new Date(s.completedAt);
      if (d >= weekStart) thisWeek++;
      if (d >= monthStart) monthVolume += s.volume;
    }
    const streak = computeDayStreak(sessions.map((s) => new Date(s.completedAt)));
    return { total: sessions.length, thisWeek, monthVolume, streak };
  }, [sessions]);

  return (
    <Animated.View entering={FadeInDown.duration(400)} style={styles.overview}>
      <View style={styles.overviewTile}>
        <Text style={styles.overviewValue}>{stats.total}</Text>
        <Text style={styles.overviewLabel}>Workouts</Text>
      </View>
      <View style={styles.overviewDivider} />
      <View style={styles.overviewTile}>
        <View style={styles.streakValueRow}>
          <Ionicons name="flame" size={16} color={stats.streak > 0 ? Palette.accent : Palette.mutedSoft} />
          <Text style={[styles.overviewValue, stats.streak > 0 && styles.accentValue]}>
            {stats.streak}
          </Text>
        </View>
        <Text style={styles.overviewLabel}>Day streak</Text>
      </View>
      <View style={styles.overviewDivider} />
      <View style={styles.overviewTile}>
        <Text style={styles.overviewValue}>{formatVolume(stats.monthVolume)}</Text>
        <Text style={styles.overviewLabel}>Lb this month</Text>
      </View>
    </Animated.View>
  );
}

function SessionCard({
  item,
  index,
  editing,
  onDelete,
}: {
  item: WorkoutSessionSummary;
  index: number;
  editing: boolean;
  onDelete: (id: string) => void;
}) {
  const date = new Date(item.completedAt);
  const dayAbbr = DAY_ABBR[date.getDay()];
  const dayNum = date.getDate();
  const monthAbbr = MONTH_ABBR[date.getMonth()];
  const duration = formatDuration(item.startedAt, item.completedAt);
  const volume = formatVolume(item.volume);

  const handleDeletePress = () => {
    Alert.alert("Delete Session", `Remove "${item.name}" from history?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => onDelete(item.id) },
    ]);
  };

  return (
    <Animated.View entering={FadeInDown.delay(index * 50).duration(320)}>
      <Pressable
        style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
        onPress={() => !editing && router.push(`/(tabs)/History/${item.id}` as any)}
      >
        <View style={styles.accentBar} />
        <View style={styles.dateBlock}>
          <Text style={styles.dayAbbr}>{dayAbbr}</Text>
          <Text style={styles.dayNum}>{dayNum}</Text>
          <Text style={styles.monthAbbr}>{monthAbbr}</Text>
        </View>
        <View style={styles.cardBody}>
          <Text style={styles.cardTitle} numberOfLines={1}>{item.name}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.metaStat}>{item.exerciseCount} ex</Text>
            <View style={styles.metaDivider} />
            <Text style={styles.metaStat}>{item.completedSetCount} sets</Text>
            <View style={styles.metaDivider} />
            <Text style={styles.metaStat}>{duration}</Text>
          </View>
          {item.volume > 0 && (
            <Text style={styles.volumeStat}>{volume} lb lifted</Text>
          )}
        </View>
        {editing ? (
          <Pressable onPress={handleDeletePress} style={styles.deleteBtn} hitSlop={8}>
            <Ionicons name="trash-outline" size={18} color="#ef4444" />
          </Pressable>
        ) : (
          <Ionicons name="chevron-forward" size={16} color={Palette.muted} style={styles.chevron} />
        )}
      </Pressable>
    </Animated.View>
  );
}

type Section = { title: string; data: WorkoutSessionSummary[] };

export default function HistoryScreen() {
  const { sessions, loading, deleteOne } = useSessionHistory();
  const [editing, setEditing] = useState(false);

  const sections: Section[] = useMemo(() => {
    const map = new Map<string, WorkoutSessionSummary[]>();
    for (const s of sessions) {
      const d = new Date(s.completedAt);
      const key = `${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(s);
    }
    return Array.from(map.entries()).map(([title, data]) => ({ title, data }));
  }, [sessions]);

  let globalIndex = 0;

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>Training log</Text>
          <Text style={styles.headerTitle}>History</Text>
        </View>
        {sessions.length > 0 && (
          <Pressable onPress={() => setEditing((e) => !e)} style={styles.editBtnWrap} hitSlop={8}>
            <Text style={styles.editBtn}>{editing ? "Done" : "Edit"}</Text>
          </Pressable>
        )}
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={Palette.accent} />
        </View>
      ) : sessions.length === 0 ? (
        <View style={styles.center}>
          <View style={styles.emptyIcon}>
            <Ionicons name="barbell-outline" size={28} color={Palette.muted} />
          </View>
          <Text style={styles.emptyTitle}>No completed workouts yet</Text>
          <Text style={styles.emptySub}>Finish a session and it will appear here</Text>
        </View>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          stickySectionHeadersEnabled={false}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={<OverviewCard sessions={sessions} />}
          renderSectionHeader={({ section }) => (
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <View style={styles.sectionRule} />
              <Text style={styles.sectionCount}>{section.data.length}</Text>
            </View>
          )}
          renderItem={({ item }) => {
            const idx = globalIndex++;
            return <SessionCard item={item} index={idx} editing={editing} onDelete={deleteOne} />;
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Palette.ink,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: Palette.hairlineStrong,
  },
  eyebrow: {
    fontFamily: FontFamilies.medium,
    fontSize: 10,
    color: Palette.accent,
    letterSpacing: 2.5,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  headerTitle: {
    fontFamily: FontFamilies.displaySemibold,
    fontSize: 34,
    color: Palette.bone,
    letterSpacing: -0.8,
    lineHeight: 36,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },

  // Overview
  overview: {
    flexDirection: "row",
    backgroundColor: Palette.inkRaised,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Palette.hairlineStrong,
    paddingVertical: 18,
    marginTop: 16,
    marginBottom: 4,
    overflow: "hidden",
  },
  overviewTile: {
    flex: 1,
    alignItems: "center",
    gap: 6,
  },
  streakValueRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  overviewValue: {
    fontFamily: FontFamilies.displaySemibold,
    fontSize: 26,
    color: Palette.bone,
    letterSpacing: -0.5,
  },
  accentValue: {
    color: Palette.accent,
  },
  overviewLabel: {
    fontFamily: FontFamilies.medium,
    fontSize: 10,
    color: Palette.muted,
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  overviewDivider: {
    width: 1,
    backgroundColor: Palette.hairlineStrong,
    marginVertical: 2,
  },

  // Section header
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 22,
    marginBottom: 10,
    marginLeft: 4,
  },
  sectionTitle: {
    fontFamily: FontFamilies.semibold,
    fontSize: 11,
    color: Palette.bone,
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  sectionRule: {
    flex: 1,
    height: 1,
    backgroundColor: Palette.hairline,
  },
  sectionCount: {
    fontFamily: FontFamilies.medium,
    fontSize: 11,
    color: Palette.muted,
    letterSpacing: 0.5,
  },

  // Card
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Palette.inkRaised,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Palette.hairlineStrong,
    marginBottom: 12,
    overflow: "hidden",
  },
  cardPressed: {
    opacity: 0.7,
    borderColor: Palette.accentBorderSoft,
  },
  accentBar: {
    width: 3,
    alignSelf: "stretch",
    backgroundColor: Palette.accent,
  },
  dateBlock: {
    alignItems: "center",
    justifyContent: "center",
    width: 54,
    paddingVertical: 14,
    gap: 1,
  },
  dayAbbr: {
    fontFamily: FontFamilies.medium,
    fontSize: 9,
    color: Palette.muted,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  dayNum: {
    fontFamily: FontFamilies.displaySemibold,
    fontSize: 22,
    color: Palette.bone,
    lineHeight: 26,
  },
  monthAbbr: {
    fontFamily: FontFamilies.medium,
    fontSize: 9,
    color: Palette.accent,
    letterSpacing: 1,
  },
  cardBody: {
    flex: 1,
    paddingVertical: 13,
    paddingLeft: 14,
    paddingRight: 8,
    gap: 5,
    borderLeftWidth: 1,
    borderLeftColor: "rgba(245,243,239,0.28)",
  },
  cardTitle: {
    fontFamily: FontFamilies.semibold,
    fontSize: 15,
    color: "#ffffff",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  metaStat: {
    fontFamily: FontFamilies.regular,
    fontSize: 12,
    color: Palette.muted,
  },
  metaDivider: {
    width: 1,
    height: 10,
    backgroundColor: Palette.hairlineStrong,
  },
  volumeStat: {
    fontFamily: FontFamilies.medium,
    fontSize: 11,
    color: Palette.accent,
    letterSpacing: 0.2,
  },
  chevron: {
    marginRight: 12,
  },

  // States
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 60,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: Palette.inkRaised,
    borderWidth: 1,
    borderColor: Palette.hairline,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    fontFamily: FontFamilies.semibold,
    fontSize: 15,
    color: Palette.bone,
    marginBottom: 4,
  },
  emptySub: {
    fontFamily: FontFamilies.regular,
    fontSize: 13,
    color: Palette.muted,
    textAlign: "center",
    paddingHorizontal: 40,
  },
  editBtnWrap: {
    paddingBottom: 4,
  },
  editBtn: {
    fontFamily: FontFamilies.medium,
    fontSize: 14,
    color: Palette.accent,
  },
  deleteBtn: {
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
});
