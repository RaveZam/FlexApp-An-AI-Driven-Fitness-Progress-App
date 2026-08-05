import { FontFamilies } from "@/constants/theme";
import { usePalette, type Palette } from "@/src/theme";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { formatSessionDate } from "../../helpers/formatSessionDate";
import { useExerciseSessionSets } from "../../hooks/ProgressiveOverload/useExerciseSessionSets";
import type { ExerciseProgress } from "../../types/progressiveOverload";
import { ProgressionChart } from "./ProgressionChart";

type Props = {
  visible: boolean;
  exercise: ExerciseProgress;
  onClose: () => void;
};

export function ExerciseHistoryModal({ visible, exercise, onClose }: Props) {
  const p = usePalette();
  const styles = useMemo(() => makeStyles(p), [p]);
  const { points } = exercise;
  const [selectedIndex, setSelectedIndex] = useState(points.length - 1);

  // Reopening (or switching exercises while open) should always land on the
  // latest session, not whatever was selected last time.
  useEffect(() => {
    if (visible) setSelectedIndex(points.length - 1);
  }, [visible, exercise.name, points.length]);

  const selectedPoint = points[selectedIndex] ?? null;
  const { sets } = useExerciseSessionSets(
    selectedPoint?.sessionId ?? null,
    exercise.name,
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />
        <View style={styles.sheet}>
          <View style={styles.handle} />

          <View style={styles.header}>
            <Text style={styles.exerciseName} numberOfLines={1}>
              {exercise.name}
            </Text>
            <TouchableOpacity onPress={onClose} hitSlop={8}>
              <Ionicons name="close-circle" size={26} color={p.mutedSoft} />
            </TouchableOpacity>
          </View>

          <View style={styles.chartRow}>
            <ProgressionChart
              points={points}
              selectedIndex={selectedIndex}
              onSelectIndex={setSelectedIndex}
            />
          </View>

          <ScrollView
            style={styles.detail}
            contentContainerStyle={styles.detailContent}
            showsVerticalScrollIndicator={false}
          >
            {selectedPoint && (
              <Text style={styles.sessionDate}>
                {formatSessionDate(selectedPoint.startedAt)}
              </Text>
            )}

            {sets.length === 0 ? (
              <Text style={styles.emptyText}>No sets recorded</Text>
            ) : (
              <View style={styles.setTable}>
                <View style={[styles.setRow, styles.setHeaderRow]}>
                  <Text style={[styles.setHeaderCell, styles.setNumCol]}>#</Text>
                  <Text style={styles.setHeaderCell}>Reps</Text>
                  <Text style={styles.setHeaderCell}>Weight</Text>
                  <Text style={[styles.setHeaderCell, styles.setCheckCol]}>
                    Done
                  </Text>
                </View>
                {sets.map((set, i) => (
                  <View
                    key={`${set.setIndex}-${i}`}
                    style={[
                      styles.setRow,
                      i !== sets.length - 1 && styles.setRowDivider,
                      !set.completed && styles.setRowDim,
                    ]}
                  >
                    <Text style={[styles.setCell, styles.setNumCol]}>
                      {set.setIndex + 1}
                    </Text>
                    <Text style={styles.setCell}>
                      {set.actualRepsLeft != null || set.actualRepsRight != null
                        ? `${set.actualRepsLeft ?? 0}/${set.actualRepsRight ?? 0}`
                        : (set.actualReps ?? set.targetReps)}
                    </Text>
                    <Text style={styles.setCell}>
                      {set.weight != null ? `${set.weight} lb` : "—"}
                    </Text>
                    <View style={styles.setCheckCol}>
                      {set.completed ? (
                        <Ionicons
                          name="checkmark-circle"
                          size={16}
                          color={p.accent}
                        />
                      ) : (
                        <Ionicons
                          name="ellipse-outline"
                          size={16}
                          color={p.mutedSoft}
                        />
                      )}
                    </View>
                  </View>
                ))}
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const makeStyles = (p: Palette) =>
  StyleSheet.create({
    overlay: { flex: 1, justifyContent: "flex-end" },
    backdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(0,0,0,0.5)",
    },
    sheet: {
      backgroundColor: p.ink,
      borderTopLeftRadius: 22,
      borderTopRightRadius: 22,
      borderWidth: 1,
      borderColor: p.hairline,
      paddingTop: 10,
      paddingHorizontal: 20,
      paddingBottom: 28,
      maxHeight: "78%",
    },
    handle: {
      alignSelf: "center",
      width: 36,
      height: 4,
      borderRadius: 2,
      backgroundColor: p.hairlineStrong,
      marginBottom: 14,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 10,
      marginBottom: 18,
    },
    exerciseName: {
      flex: 1,
      color: p.bone,
      fontSize: 18,
      fontFamily: FontFamilies.semibold,
      letterSpacing: -0.2,
    },
    chartRow: {
      alignItems: "center",
      marginBottom: 20,
    },
    detail: { flexGrow: 0 },
    detailContent: { paddingBottom: 8 },
    sessionDate: {
      color: p.muted,
      fontSize: 11,
      fontFamily: FontFamilies.medium,
      letterSpacing: 1.2,
      textTransform: "uppercase",
      marginBottom: 10,
    },
    emptyText: {
      color: p.muted,
      fontSize: 13,
      fontFamily: FontFamilies.regular,
      paddingVertical: 12,
    },
    setTable: {
      borderRadius: 12,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: p.hairline,
      overflow: "hidden",
    },
    setRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 14,
      paddingVertical: 10,
    },
    setHeaderRow: { backgroundColor: p.hairline },
    setRowDivider: {
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: p.hairline,
    },
    setRowDim: { opacity: 0.4 },
    setHeaderCell: {
      flex: 1,
      color: p.muted,
      fontSize: 10,
      fontFamily: FontFamilies.medium,
      letterSpacing: 0.4,
      textTransform: "uppercase",
    },
    setCell: {
      flex: 1,
      color: p.bone,
      fontSize: 14,
      fontFamily: FontFamilies.regular,
      fontVariant: ["tabular-nums"],
    },
    setNumCol: { flex: 0, width: 24 },
    setCheckCol: { flex: 0, width: 32, alignItems: "flex-end" },
  });
