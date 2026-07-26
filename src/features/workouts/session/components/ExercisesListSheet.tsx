import { usePalette, type Palette } from "@/src/theme";
import { Ionicons } from "@expo/vector-icons";
import { useMemo } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useGetCompletedSetCount } from "../hooks/useGetCompletedSetCount";
import { useWorkoutSession } from "../hooks/useWorkoutSession";
import type { SessionExercise } from "../sessionView";

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function ExercisesListSheet({ visible, onClose }: Props) {
  const p = usePalette();
  const styles = useMemo(() => makeStyles(p), [p]);
  const { exercises, activeIndex, setActiveIndex } = useWorkoutSession();

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
            <Text style={styles.title}>Exercises</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={p.bone} />
            </TouchableOpacity>
          </View>
          {exercises.map((ex, i) => (
            <ExerciseRow
              key={ex.id}
              exercise={ex}
              isActive={i === activeIndex}
              onPress={() => {
                setActiveIndex(i);
                onClose();
              }}
            />
          ))}
        </View>
      </View>
    </Modal>
  );
}

function ExerciseRow({
  exercise,
  isActive,
  onPress,
}: {
  exercise: SessionExercise;
  isActive: boolean;
  onPress: () => void;
}) {
  const p = usePalette();
  const styles = useMemo(() => makeStyles(p), [p]);
  const completed = useGetCompletedSetCount(exercise.id);

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[styles.item, isActive && styles.itemActive]}
    >
      <Text style={[styles.itemText, isActive && styles.itemTextActive]}>
        {exercise.name}
      </Text>
      <Text style={[styles.setCount, isActive && styles.setCountActive]}>
        {completed}/{exercise.targetSets} sets
      </Text>
    </TouchableOpacity>
  );
}

const makeStyles = (p: Palette) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.7)",
      justifyContent: "flex-end",
    },
    sheet: {
      backgroundColor: p.inkRaised,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 40,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
    },
    title: {
      color: p.bone,
      fontSize: 16,
      fontFamily: "Inter_500Medium",
      letterSpacing: 0.3,
    },
    item: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 14,
      paddingHorizontal: 12,
      borderRadius: 12,
      marginBottom: 4,
    },
    itemActive: { backgroundColor: p.accentSoft },
    itemText: {
      color: p.muted,
      fontSize: 14,
      fontFamily: "Inter_400Regular",
      letterSpacing: 0.2,
    },
    itemTextActive: { color: p.bone, fontFamily: "Inter_500Medium" },
    setCount: {
      color: p.muted,
      fontSize: 12,
      fontFamily: "Outfit_400Regular",
      fontVariant: ["tabular-nums"],
      letterSpacing: 0.3,
    },
    setCountActive: { color: p.accent },
  });
