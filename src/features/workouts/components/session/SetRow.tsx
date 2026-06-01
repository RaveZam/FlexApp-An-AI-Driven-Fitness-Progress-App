import { SessionSetView } from "@/src/features/workouts/types/sessionView";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  FadeInDown,
  ZoomIn,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

const ACCENT = "#34d399";
const BONE = "#f5f3ef";
const INK = "#060606";
const HAIRLINE = "rgba(245,243,239,0.07)";
const HAIRLINE_STRONG = "rgba(245,243,239,0.14)";
const MUTED = "#6b6b6b";
const MUTED_SOFT = "#3a3a3a";

type SetRowProps = {
  set: SessionSetView;
  isCurrent: boolean;
  index: number;
  onEdit?: (setId: string) => void;
};

export default function SetRow({ set, isCurrent, index, onEdit }: SetRowProps) {
  const isCompleted = set.completed;
  const isFuture = !isCompleted && !isCurrent;

  const pulse = useSharedValue(0);
  useEffect(() => {
    if (isCurrent) {
      pulse.value = withRepeat(
        withTiming(1, { duration: 1600, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      );
    } else {
      cancelAnimation(pulse);
      pulse.value = 0;
    }
    return () => cancelAnimation(pulse);
  }, [isCurrent, pulse]);

  const pulseStyle = useAnimatedStyle(() => ({
    opacity: 0.35 + pulse.value * 0.55,
    transform: [{ scale: 1 + pulse.value * 0.08 }],
  }));

  const setNumber = set.setNumber.toString().padStart(2, "0");

  const editable = isCompleted && !!onEdit;

  return (
    <Animated.View entering={FadeInDown.delay(200 + index * 60).duration(420)}>
    <Pressable
      onPress={editable ? () => onEdit!(set.id) : undefined}
      disabled={!editable}
      android_ripple={editable ? { color: "rgba(52,211,153,0.12)" } : undefined}
      style={({ pressed }) => [
        styles.row,
        isCompleted && styles.rowCompleted,
        isCurrent && styles.rowCurrent,
        isFuture && styles.rowFuture,
        editable && pressed && styles.rowPressed,
      ]}
    >
      {/* Left rail */}
      <View
        style={[
          styles.rail,
          isCompleted && styles.railCompleted,
          isCurrent && styles.railCurrent,
        ]}
      />

      {/* Set index */}
      <View style={styles.indexCol}>
        <Text
          style={[
            styles.indexEyebrow,
            isCurrent && { color: ACCENT },
            isFuture && { color: MUTED_SOFT },
          ]}
        >
          Set
        </Text>
        <Text
          style={[
            styles.indexNumber,
            isCurrent && styles.indexNumberCurrent,
            isFuture && styles.indexNumberFuture,
          ]}
        >
          {setNumber}
        </Text>
      </View>

      <View style={styles.colDivider} />

      {/* Value column */}
      <View style={styles.valueCol}>
        {isCompleted ? (
          <View style={styles.valueLine}>
            <Text style={styles.valueNumber}>{set.weight}</Text>
            <Text style={styles.valueUnit}>lb</Text>
            <Text style={styles.valueX}>×</Text>
            {set.actualRepsLeft != null || set.actualRepsRight != null ? (
              <>
                <Text style={styles.valueNumber}>
                  {set.actualRepsLeft ?? 0}/{set.actualRepsRight ?? 0}
                </Text>
                <Text style={styles.valueUnit}>L/R</Text>
              </>
            ) : (
              <>
                <Text style={styles.valueNumber}>{set.actualReps}</Text>
                <Text style={styles.valueUnit}>reps</Text>
              </>
            )}
            {onEdit && <Ionicons name="pencil" size={11} color={MUTED} style={styles.editIcon} />}
          </View>
        ) : isCurrent ? (
          <>
            <Text style={styles.currentEyebrow}>Tap log set</Text>
            <View style={styles.valueLine}>
              <Text style={styles.valueDash}>—</Text>
              <Text style={styles.valueX}>×</Text>
              <Text style={styles.valueNumberCurrent}>{set.targetReps}</Text>
              <Text style={styles.valueUnitCurrent}>target</Text>
            </View>
          </>
        ) : (
          <View style={styles.valueLine}>
            <Text style={styles.valueDashFuture}>—</Text>
            <Text style={styles.valueXFuture}>×</Text>
            <Text style={styles.valueNumberFuture}>{set.targetReps}</Text>
            <Text style={styles.valueUnitFuture}>target</Text>
          </View>
        )}
      </View>

      {/* Status badge */}
      <View style={styles.statusCol}>
        {isCompleted ? (
          <Animated.View entering={ZoomIn.springify().damping(14)} style={styles.statusComplete}>
            <Ionicons name="checkmark" size={16} color={INK} />
          </Animated.View>
        ) : isCurrent ? (
          <View style={styles.statusCurrent}>
            <Animated.View style={[styles.statusCurrentRing, pulseStyle]} />
            <View style={styles.statusCurrentDot} />
          </View>
        ) : (
          <View style={styles.statusFuture} />
        )}
      </View>
    </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0a0a0a",
    borderRadius: 14,
    height: 72,
    overflow: "hidden",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: HAIRLINE,
  },
  rowCompleted: {
    backgroundColor: "#0c0c0c",
    borderColor: "rgba(52,211,153,0.18)",
  },
  rowCurrent: {
    backgroundColor: "#0a0a0a",
    borderColor: "rgba(52,211,153,0.35)",
  },
  rowFuture: { opacity: 0.55 },
  rowPressed: { opacity: 0.7 },
  editIcon: { marginLeft: 10, opacity: 0.55 },

  rail: {
    width: 2,
    alignSelf: "stretch",
    backgroundColor: HAIRLINE,
    marginRight: 14,
  },
  railCompleted: { backgroundColor: ACCENT },
  railCurrent: { backgroundColor: ACCENT, opacity: 0.7 },

  indexCol: {
    width: 52,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  indexEyebrow: {
    color: MUTED,
    fontSize: 8,
    fontFamily: "Inter_500Medium",
    letterSpacing: 2.2,
    textTransform: "uppercase",
    marginBottom: 2,
  },
  indexNumber: {
    color: BONE,
    fontSize: 26,
    fontFamily: "Outfit_300Light",
    letterSpacing: -0.5,
    fontVariant: ["tabular-nums"],
    lineHeight: 30,
  },
  indexNumberCurrent: { color: BONE, fontFamily: "Outfit_400Regular" },
  indexNumberFuture: { color: MUTED_SOFT },

  colDivider: {
    width: StyleSheet.hairlineWidth,
    height: 36,
    backgroundColor: HAIRLINE_STRONG,
    marginRight: 16,
  },

  valueCol: { flex: 1, justifyContent: "center" },
  valueLine: { flexDirection: "row", alignItems: "baseline" },
  valueNumber: {
    color: BONE,
    fontSize: 22,
    fontFamily: "Outfit_400Regular",
    letterSpacing: -0.3,
    fontVariant: ["tabular-nums"],
  },
  valueNumberCurrent: {
    color: BONE,
    fontSize: 22,
    fontFamily: "Outfit_400Regular",
    letterSpacing: -0.3,
    fontVariant: ["tabular-nums"],
  },
  valueNumberFuture: {
    color: MUTED,
    fontSize: 22,
    fontFamily: "Outfit_300Light",
    letterSpacing: -0.3,
    fontVariant: ["tabular-nums"],
  },
  valueUnit: {
    color: MUTED,
    fontSize: 10,
    fontFamily: "Inter_500Medium",
    letterSpacing: 1.4,
    textTransform: "uppercase",
    marginLeft: 4,
  },
  valueUnitCurrent: {
    color: ACCENT,
    fontSize: 10,
    fontFamily: "Inter_500Medium",
    letterSpacing: 1.4,
    textTransform: "uppercase",
    marginLeft: 4,
  },
  valueUnitFuture: {
    color: MUTED_SOFT,
    fontSize: 10,
    fontFamily: "Inter_400Regular",
    letterSpacing: 1.4,
    textTransform: "uppercase",
    marginLeft: 4,
  },
  valueX: {
    color: MUTED,
    fontSize: 14,
    fontFamily: "Outfit_300Light",
    marginHorizontal: 8,
  },
  valueXFuture: {
    color: MUTED_SOFT,
    fontSize: 14,
    fontFamily: "Outfit_300Light",
    marginHorizontal: 8,
  },
  valueDash: {
    color: MUTED,
    fontSize: 22,
    fontFamily: "Outfit_300Light",
  },
  valueDashFuture: {
    color: MUTED_SOFT,
    fontSize: 22,
    fontFamily: "Outfit_300Light",
  },
  currentEyebrow: {
    color: ACCENT,
    fontSize: 8,
    fontFamily: "Inter_500Medium",
    letterSpacing: 2.2,
    textTransform: "uppercase",
    marginBottom: 4,
  },

  statusCol: {
    width: 64,
    alignItems: "center",
    justifyContent: "center",
  },
  statusComplete: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: ACCENT,
  },
  statusCurrent: {
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  statusCurrentRing: {
    position: "absolute",
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: ACCENT,
  },
  statusCurrentDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: ACCENT,
  },
  statusFuture: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: HAIRLINE_STRONG,
  },
});
