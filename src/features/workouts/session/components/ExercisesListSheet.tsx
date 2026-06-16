import { Ionicons } from "@expo/vector-icons";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useWorkoutSession } from "../hooks/useWorkoutSession";

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function ExercisesListSheet({ visible, onClose }: Props) {
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
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          {exercises.map((ex, i) => {
            const isActive = i === activeIndex;
            return (
              <TouchableOpacity
                key={ex.id}
                activeOpacity={0.7}
                onPress={() => {
                  setActiveIndex(i);
                  onClose();
                }}
                style={[styles.item, isActive && styles.itemActive]}
              >
                <Text
                  style={[styles.itemText, isActive && styles.itemTextActive]}
                >
                  {ex.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#1a1a1a",
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
    color: "#fff",
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
  itemActive: { backgroundColor: "rgba(16,185,129,0.1)" },
  itemText: {
    color: "#666",
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    letterSpacing: 0.2,
  },
  itemTextActive: { color: "#fff", fontFamily: "Inter_500Medium" },
});
