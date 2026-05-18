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
  const duration = formatDuration(item.startedAt, item.completedAt);

  const handleDeletePress = () => {
    Alert.alert(
      "Delete Session",
      `Remove "${item.name}" from history?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => onDelete(item.id) },
      ]
    );
  };

  return (
    <Animated.View entering={FadeInDown.delay(index * 60).duration(350)}>
      <Pressable
        style={({ pressed }) => [styles.card, pressed && { opacity: 0.75 }]}
        onPress={() => !editing && router.push(`/(tabs)/History/${item.id}` as any)}
      >
        <View style={styles.accentBar} />
        <View style={styles.dateBlock}>
          <Text style={styles.dayAbbr}>{dayAbbr}</Text>
          <Text style={styles.dayNum}>{dayNum}</Text>
        </View>
        <View style={styles.cardBody}>
          <Text style={styles.cardTitle} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.cardMeta}>
            {item.exerciseCount} exercise{item.exerciseCount !== 1 ? "s" : ""} · {item.completedSetCount} sets · {duration}
          </Text>
        </View>
        {editing ? (
          <Pressable onPress={handleDeletePress} style={styles.deleteBtn} hitSlop={8}>
            <Ionicons name="trash-outline" size={18} color="#ef4444" />
          </Pressable>
        ) : (
          <Ionicons name="chevron-forward" size={16} color={Palette.muted} style={{ marginRight: 4 }} />
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
          <Text style={styles.headerTitle}>History</Text>
          {sessions.length > 0 && (
            <Text style={styles.headerSub}>{sessions.length} session{sessions.length !== 1 ? "s" : ""}</Text>
          )}
        </View>
        {sessions.length > 0 && (
          <Pressable onPress={() => setEditing((e) => !e)} style={styles.editBtnWrap}>
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
          <Ionicons name="time-outline" size={40} color={Palette.mutedSoft} style={{ marginBottom: 12 }} />
          <Text style={styles.emptyTitle}>No completed workouts yet</Text>
          <Text style={styles.emptySub}>Finish a session and it will appear here</Text>
        </View>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          stickySectionHeadersEnabled={false}
          renderSectionHeader={({ section }) => (
            <Text style={styles.sectionHeader}>{section.title}</Text>
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
  },
  headerTitle: {
    fontFamily: FontFamilies.displaySemibold,
    fontSize: 28,
    color: Palette.bone,
    letterSpacing: -0.5,
  },
  headerSub: {
    fontFamily: FontFamilies.regular,
    fontSize: 13,
    color: Palette.muted,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  sectionHeader: {
    fontFamily: FontFamilies.semibold,
    fontSize: 11,
    color: Palette.muted,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginTop: 20,
    marginBottom: 8,
    marginLeft: 4,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#191919",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(245,243,239,0.04)",
    marginBottom: 8,
    overflow: "hidden",
  },
  accentBar: {
    width: 3,
    alignSelf: "stretch",
    backgroundColor: Palette.accent,
  },
  dateBlock: {
    alignItems: "center",
    justifyContent: "center",
    width: 48,
    paddingVertical: 14,
    gap: 2,
  },
  dayAbbr: {
    fontFamily: FontFamilies.medium,
    fontSize: 9,
    color: Palette.muted,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  dayNum: {
    fontFamily: FontFamilies.bold,
    fontSize: 20,
    color: Palette.bone,
    lineHeight: 24,
  },
  cardBody: {
    flex: 1,
    paddingVertical: 14,
    paddingRight: 8,
    gap: 3,
  },
  cardTitle: {
    fontFamily: FontFamilies.medium,
    fontSize: 15,
    color: "#ffffff",
  },
  cardMeta: {
    fontFamily: FontFamilies.regular,
    fontSize: 12,
    color: Palette.muted,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 60,
  },
  emptyTitle: {
    fontFamily: FontFamilies.medium,
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
    paddingBottom: 2,
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
