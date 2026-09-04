import { usePalette, type Palette } from "@/src/theme";
import React, { useMemo } from "react";
import { ActivityIndicator, SectionList, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import HistoryEmptyState from "../components/HistoryEmptyState";
import HistoryMasthead from "../components/HistoryMasthead";
import MonthMarker from "../components/MonthMarker";
import SessionActionSheet from "../components/SessionActionSheet";
import SessionEntry from "../components/SessionEntry";
import { useHistoryScreen } from "../hooks/useHistoryScreen";

export default function HistoryScreen() {
  const p = usePalette();
  const styles = useMemo(() => makeStyles(p), [p]);
  const {
    loading,
    isEmpty,
    sections,
    stats,
    weeks,
    peakWeek,
    peakSession,
    menuSession,
    openMenu,
    closeMenu,
    deleteSession,
    openSession,
  } = useHistoryScreen();

  const masthead = <HistoryMasthead stats={stats} weeks={weeks} peakWeek={peakWeek} />;

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={p.accent} />
        </View>
      ) : (
        <SectionList
          sections={isEmpty ? [] : sections}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          stickySectionHeadersEnabled={false}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={masthead}
          ListEmptyComponent={<HistoryEmptyState />}
          renderSectionHeader={({ section }) => (
            <MonthMarker
              month={section.title}
              year={section.year}
              sessions={section.data.length}
              volume={section.volume}
            />
          )}
          renderItem={({ item }) => (
            <SessionEntry
              session={item}
              peak={peakSession}
              onOpen={openSession}
              onMenu={openMenu}
            />
          )}
        />
      )}

      <SessionActionSheet
        session={menuSession}
        onClose={closeMenu}
        onDelete={deleteSession}
      />
    </SafeAreaView>
  );
}

const makeStyles = (p: Palette) =>
  StyleSheet.create({
    safe: { flex: 1, backgroundColor: p.ink },
    list: { paddingHorizontal: 20, paddingBottom: 40 },
    center: { flex: 1, alignItems: "center", justifyContent: "center" },
  });
