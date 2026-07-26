import { usePalette, type Palette } from "@/src/theme";
import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { currentSetIndex } from "../core/sessionSetProgress";
import { useGetSessionSets } from "../hooks/useGetSessionSets";
import { useWorkoutSession } from "../hooks/useWorkoutSession";
import SetRow from "./SetRow";

// Renders the planned sets of the active exercise below the "Now Lifting" card.
// Self-sources from the session context so the screen stays UI-only.
export default function SessionSetList() {
  const p = usePalette();
  const styles = useMemo(() => makeStyles(p), [p]);
  const { exercises, activeIndex } = useWorkoutSession();
  const active = exercises[activeIndex];
  const sets = useGetSessionSets(active.id);

  const completed = sets.filter((s) => s.completed).length;
  const currentIndex = currentSetIndex(sets);

  return (
    <View>
      <View style={styles.setsHeader}>
        <Text style={styles.sectionLabel}>Sets</Text>
        <Text style={styles.setsCounter}>
          {completed} / {sets.length}
        </Text>
      </View>

      <View style={styles.setsContainer}>
        {sets.map((set, index) => (
          <SetRow
            key={set.id}
            set={set}
            index={index}
            isCurrent={index === currentIndex}
          />
        ))}
      </View>
    </View>
  );
}

const makeStyles = (p: Palette) =>
  StyleSheet.create({
    setsHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      marginTop: 26,
      marginBottom: 14,
    },
    sectionLabel: {
      color: p.muted,
      fontSize: 9,
      fontFamily: "Inter_500Medium",
      letterSpacing: 2,
      textTransform: "uppercase",
    },
    setsCounter: {
      color: p.muted,
      fontSize: 11,
      fontFamily: "Outfit_400Regular",
      fontVariant: ["tabular-nums"],
      letterSpacing: 0.4,
    },
    setsContainer: { paddingHorizontal: 20, gap: 10 },
  });
