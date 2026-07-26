import { FontFamilies } from "@/constants/theme";
import type { Workout } from "@/src/features/workouts";
import { usePalette, type Palette } from "@/src/theme";
import { Ionicons } from "@expo/vector-icons";
import { useMemo } from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const DAY_LABELS = ["S", "M", "T", "W", "Th", "F", "S"] as const;

type Props = {
  visible: boolean;
  workouts: Workout[];
  onPick: (workout: Workout) => void;
  onClose: () => void;
};

export default function WorkoutPickerModal({
  visible,
  workouts,
  onPick,
  onClose,
}: Props) {
  const p = usePalette();
  const styles = useMemo(() => makeStyles(p), [p]);
  //returns workout id picked upon confirming
  function confirmPick(workout: Workout) {
    Alert.alert(workout.name, "Set this as today's workout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Set", onPress: () => onPick(workout) },
    ]);
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>Choose a Workout</Text>
            <TouchableOpacity onPress={onClose} hitSlop={8}>
              <Ionicons name="close" size={22} color={p.bone} />
            </TouchableOpacity>
          </View>

          {workouts.map((workout) => (
            <TouchableOpacity
              key={workout.id}
              style={styles.row}
              activeOpacity={0.7}
              onPress={() => confirmPick(workout)}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.rowTitle}>{workout.name}</Text>
                <View style={styles.dayRow}>
                  {DAY_LABELS.map((label, i) => {
                    const on = workout.daysOfWeek.includes(i);
                    return (
                      <View
                        key={i}
                        style={[styles.dayChip, on && styles.dayChipOn]}
                      >
                        <Text style={[styles.dayText, on && styles.dayTextOn]}>
                          {label}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </View>
              <Ionicons
                name="chevron-forward"
                size={16}
                color={p.muted}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Modal>
  );
}

const makeStyles = (p: Palette) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      justifyContent: "flex-end",
      backgroundColor: "rgba(0,0,0,0.5)",
    },
    sheet: {
      backgroundColor: p.inkRaised,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingHorizontal: 20,
      paddingTop: 18,
      paddingBottom: 32,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 16,
    },
    title: {
      color: p.bone,
      fontSize: 15,
      fontFamily: FontFamilies.displayMedium,
      letterSpacing: -0.2,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 14,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: p.hairline,
    },
    rowTitle: {
      color: p.bone,
      fontSize: 14,
      fontFamily: FontFamilies.displayMedium,
      marginBottom: 6,
    },
    dayRow: { flexDirection: "row", gap: 4 },
    dayChip: {
      width: 20,
      height: 20,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: p.inkSunken,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: p.hairline,
    },
    dayChipOn: {
      backgroundColor: p.accent,
      borderColor: p.accent,
    },
    dayText: {
      color: p.muted,
      fontSize: 9,
      fontFamily: FontFamilies.medium,
    },
    dayTextOn: { color: p.onAccent, fontFamily: FontFamilies.medium },
  });
