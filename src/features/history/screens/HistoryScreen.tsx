import { FontFamilies } from "@/constants/theme";
import { usePalette, type Palette } from "@/src/theme";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  SectionList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSessionHistory } from "../hooks/useSessionHistory";
import { formatDuration, formatVolume, type OverviewStats } from "../sessionStats";
import type { WorkoutSessionSummary } from "../types";

const STATUS_COLOR: Record<WorkoutSessionSummary["status"], string> = {
  completed: "#22c55e",
  in_progress: "#eab308",
  cancelled: "#ef4444",
};

const DAY_ABBR = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const MONTH_ABBR = [
  "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
  "JUL", "AUG", "SEP", "OCT", "NOV", "DEC",
];

function OverviewCard({ stats }: { stats: OverviewStats }) {
  const p = usePalette();
  const styles = useMemo(() => makeStyles(p), [p]);
  return (
    <Animated.View entering={FadeInDown.duration(400)} style={styles.overview}>
      <View style={styles.overviewTile}>
        <Text style={styles.overviewValue}>{stats.total}</Text>
        <Text style={styles.overviewLabel}>Workouts</Text>
      </View>
      <View style={styles.overviewDivider} />
      <View style={styles.overviewTile}>
        <View style={styles.streakValueRow}>
          <Ionicons name="flame" size={16} color={stats.streak > 0 ? p.accent : p.mutedSoft} />
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
  onMenu,
}: {
  item: WorkoutSessionSummary;
  index: number;
  onMenu: (item: WorkoutSessionSummary) => void;
}) {
  const p = usePalette();
  const styles = useMemo(() => makeStyles(p), [p]);
  const date = new Date(item.completedAt);
  const dayAbbr = DAY_ABBR[date.getDay()];
  const dayNum = date.getDate();
  const monthAbbr = MONTH_ABBR[date.getMonth()];
  const duration = formatDuration(item.startedAt, item.completedAt);
  const volume = formatVolume(item.volume);

  return (
    <Animated.View entering={FadeInDown.delay(index * 50).duration(320)}>
      <Pressable
        style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
        onPress={() => router.push(`/(tabs)/History/${item.id}` as any)}
      >
        <View style={styles.accentBar} />
        <View style={styles.dateBlock}>
          <Text style={styles.dayAbbr}>{dayAbbr}</Text>
          <Text style={styles.dayNum}>{dayNum}</Text>
          <Text style={styles.monthAbbr}>{monthAbbr}</Text>
        </View>
        <View style={styles.cardBody}>
          <View style={styles.titleRow}>
            <Text style={styles.cardTitle} numberOfLines={1}>{item.name}</Text>
            <View style={[styles.statusDot, { backgroundColor: STATUS_COLOR[item.status] }]} />
            <Pressable onPress={() => onMenu(item)} style={styles.menuBtn} hitSlop={10}>
              <Ionicons name="ellipsis-horizontal" size={18} color={p.muted} />
            </Pressable>
          </View>
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
      </Pressable>
    </Animated.View>
  );
}

function SessionMenu({
  session,
  onClose,
  onDelete,
}: {
  session: WorkoutSessionSummary | null;
  onClose: () => void;
  onDelete: (id: string) => void;
}) {
  const p = usePalette();
  const styles = useMemo(() => makeStyles(p), [p]);
  return (
    <Modal visible={!!session} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.menuOverlay} onPress={onClose}>
        <Pressable style={styles.menuSheet}>
          <View style={styles.menuHeader}>
            <Text style={styles.menuTitle} numberOfLines={1}>{session?.name}</Text>
            <Text style={styles.menuSubtitle}>This permanently removes the session</Text>
          </View>
          <View style={styles.menuActions}>
            <Pressable
              style={({ pressed }) => [styles.menuCancel, pressed && styles.menuPressed]}
              onPress={onClose}
            >
              <Text style={styles.menuCancelLabel}>Cancel</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [styles.menuDelete, pressed && styles.menuPressed]}
              onPress={() => {
                if (session) onDelete(session.id);
                onClose();
              }}
            >
              <Text style={styles.menuDeleteLabel}>Delete session</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export default function HistoryScreen() {
  const p = usePalette();
  const styles = useMemo(() => makeStyles(p), [p]);
  const { sessions, stats, sections, loading, deleteOne } = useSessionHistory();
  const [menuSession, setMenuSession] = useState<WorkoutSessionSummary | null>(null);

  let globalIndex = 0;

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>Training log</Text>
          <Text style={styles.headerTitle}>History</Text>
        </View>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={p.accent} />
        </View>
      ) : sessions.length === 0 ? (
        <View style={styles.center}>
          <View style={styles.emptyIcon}>
            <Ionicons name="barbell-outline" size={28} color={p.muted} />
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
          ListHeaderComponent={<OverviewCard stats={stats} />}
          renderSectionHeader={({ section }) => (
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <View style={styles.sectionRule} />
              <Text style={styles.sectionCount}>{section.data.length}</Text>
            </View>
          )}
          renderItem={({ item }) => {
            const idx = globalIndex++;
            return <SessionCard item={item} index={idx} onMenu={setMenuSession} />;
          }}
        />
      )}

      <SessionMenu
        session={menuSession}
        onClose={() => setMenuSession(null)}
        onDelete={deleteOne}
      />
    </SafeAreaView>
  );
}

const makeStyles = (p: Palette) =>
  StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: p.ink,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: p.hairlineStrong,
  },
  eyebrow: {
    fontFamily: FontFamilies.medium,
    fontSize: 10,
    color: p.accent,
    letterSpacing: 2.5,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  headerTitle: {
    fontFamily: FontFamilies.displaySemibold,
    fontSize: 34,
    color: p.bone,
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
    backgroundColor: p.inkRaised,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: p.hairlineStrong,
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
    color: p.bone,
    letterSpacing: -0.5,
  },
  accentValue: {
    color: p.accent,
  },
  overviewLabel: {
    fontFamily: FontFamilies.medium,
    fontSize: 10,
    color: p.muted,
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  overviewDivider: {
    width: 1,
    backgroundColor: p.hairlineStrong,
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
    color: p.bone,
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  sectionRule: {
    flex: 1,
    height: 1,
    backgroundColor: p.hairline,
  },
  sectionCount: {
    fontFamily: FontFamilies.medium,
    fontSize: 11,
    color: p.muted,
    letterSpacing: 0.5,
  },

  // Card
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: p.inkRaised,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: p.hairlineStrong,
    marginBottom: 12,
    overflow: "hidden",
  },
  cardPressed: {
    opacity: 0.7,
    borderColor: p.accentBorderSoft,
  },
  accentBar: {
    width: 3,
    alignSelf: "stretch",
    backgroundColor: p.accent,
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
    color: p.muted,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  dayNum: {
    fontFamily: FontFamilies.displaySemibold,
    fontSize: 22,
    color: p.bone,
    lineHeight: 26,
  },
  monthAbbr: {
    fontFamily: FontFamilies.medium,
    fontSize: 9,
    color: p.accent,
    letterSpacing: 1,
  },
  cardBody: {
    flex: 1,
    paddingVertical: 13,
    paddingLeft: 14,
    paddingRight: 6,
    gap: 5,
    borderLeftWidth: 1,
    borderLeftColor: p.hairlineStrong,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardTitle: {
    flex: 1,
    fontFamily: FontFamilies.semibold,
    fontSize: 15,
    color: p.bone,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  metaStat: {
    fontFamily: FontFamilies.regular,
    fontSize: 12,
    color: p.muted,
  },
  metaDivider: {
    width: 1,
    height: 10,
    backgroundColor: p.hairlineStrong,
  },
  volumeStat: {
    fontFamily: FontFamilies.medium,
    fontSize: 11,
    color: p.accent,
    letterSpacing: 0.2,
  },
  menuBtn: {
    paddingLeft: 10,
    paddingRight: 4,
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
    backgroundColor: p.inkRaised,
    borderWidth: 1,
    borderColor: p.hairline,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    fontFamily: FontFamilies.semibold,
    fontSize: 15,
    color: p.bone,
    marginBottom: 4,
  },
  emptySub: {
    fontFamily: FontFamilies.regular,
    fontSize: 13,
    color: p.muted,
    textAlign: "center",
    paddingHorizontal: 40,
  },
  // Session menu
  menuOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    paddingHorizontal: 28,
  },
  menuSheet: {
    backgroundColor: p.inkRaised,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: p.hairlineStrong,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
  },
  menuHeader: {
    paddingHorizontal: 6,
    paddingBottom: 18,
    marginBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: p.hairline,
    gap: 4,
  },
  menuTitle: {
    fontFamily: FontFamilies.displaySemibold,
    fontSize: 19,
    color: p.bone,
    letterSpacing: -0.3,
  },
  menuSubtitle: {
    fontFamily: FontFamilies.regular,
    fontSize: 13,
    color: p.muted,
  },
  menuActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 14,
    marginTop: 14,
  },
  menuDelete: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 16,
    borderRadius: 14,
    backgroundColor: p.dangerSoft,
    borderWidth: 1,
    borderColor: p.dangerBorder,
  },
  menuDeleteLabel: {
    fontFamily: FontFamilies.semibold,
    fontSize: 16,
    color: p.danger,
    letterSpacing: 0.2,
  },
  menuPressed: {
    opacity: 0.6,
  },
  menuCancel: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: p.hairlineStrong,
  },
  menuCancelLabel: {
    fontFamily: FontFamilies.medium,
    fontSize: 16,
    color: p.bone,
    letterSpacing: 0.2,
  },
});
