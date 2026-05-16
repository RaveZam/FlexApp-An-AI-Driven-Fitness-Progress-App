import { WorkoutSet } from "@/src/features/workouts/data/mockWorkoutSession";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown, ZoomIn } from "react-native-reanimated";

const ACCENT = "#10b981";

type SetRowProps = {
  set: WorkoutSet;
  isCurrent: boolean;
  index: number;
};

export default function SetRow({ set, isCurrent, index }: SetRowProps) {
  const isCompleted = set.completed;
  const isFuture = !isCompleted && !isCurrent;
  const isHighlighted = isCurrent || (isCompleted && index === 0);

  return (
    <Animated.View
      entering={FadeInDown.delay(200 + index * 60)
        .springify()
        .damping(20)}
      style={[
        styles.row,
        isCompleted && styles.completedRow,
        isCurrent && styles.currentRow,
        isFuture && styles.futureRow,
      ]}
    >
      {/* Weight */}
      <View style={styles.weightSection}>
        <Text
          style={[
            styles.weightText,
            isCurrent && styles.currentText,
            isFuture && styles.futureText,
          ]}
        >
          {isCompleted ? `${set.weight}lb` : isCurrent ? `Set ${set.setNumber}` : `Set ${set.setNumber}`}
        </Text>
      </View>

      {/* Divider */}
      <View
        style={[
          styles.divider,
          isCurrent && styles.currentDivider,
        ]}
      />

      {/* Reps */}
      <View style={styles.repsSection}>
        <Text
          style={[
            styles.repsText,
            isCurrent && styles.currentText,
            isFuture && styles.futureText,
          ]}
        >
          {isCompleted
            ? `${set.actualReps} Reps`
            : `${set.targetReps} Reps`}
        </Text>
      </View>

      {/* Divider */}
      <View
        style={[
          styles.divider,
          isCurrent && styles.currentDivider,
        ]}
      />

      {/* Action Area */}
      <View style={styles.actionSection}>
        {isCompleted ? (
          <Animated.View entering={ZoomIn.springify().damping(14)}>
            <Ionicons name="checkmark" size={22} color="#0a0a0a" />
          </Animated.View>
        ) : isCurrent ? (
          <Ionicons name="ellipsis-horizontal" size={18} color="#0a0a0a" />
        ) : (
          <Ionicons name="ellipsis-horizontal" size={18} color="#555" />
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#222",
    borderRadius: 50,
    height: 56,
    overflow: "hidden",
  },
  completedRow: {
    backgroundColor: ACCENT,
  },
  currentRow: {
    backgroundColor: "#2a2a2a",
    borderWidth: 1,
    borderColor: "rgba(16,185,129,0.3)",
  },
  futureRow: {
    backgroundColor: "#1a1a1a",
    opacity: 0.5,
  },
  weightSection: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: 8,
  },
  weightText: {
    color: "#0a0a0a",
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
  },
  repsSection: {
    flex: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  repsText: {
    color: "#0a0a0a",
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
  },
  currentText: {
    color: "#fff",
  },
  futureText: {
    color: "#666",
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  currentDivider: {
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  actionSection: {
    width: 56,
    alignItems: "center",
    justifyContent: "center",
  },
});
