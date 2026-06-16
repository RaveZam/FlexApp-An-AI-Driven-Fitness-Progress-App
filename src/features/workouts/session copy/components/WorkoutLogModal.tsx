import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const ACCENT = "#10b981";

type WorkoutLogModalProps = {
  visible: boolean;
  exerciseName: string;
  setNumber: number;
  totalSets: number;
  targetReps: number;
  isUnilateral?: boolean;
  mode?: "log" | "edit";
  initialWeight?: number | null;
  initialReps?: number | null;
  initialLeftReps?: number | null;
  initialRightReps?: number | null;
  onLog: (
    weight: number,
    actualReps: number | null,
    leftReps: number | null,
    rightReps: number | null
  ) => void;
  onClose: () => void;
};

export default function WorkoutLogModal({
  visible,
  exerciseName,
  setNumber,
  totalSets,
  targetReps,
  isUnilateral = false,
  mode = "log",
  initialWeight,
  initialReps,
  initialLeftReps,
  initialRightReps,
  onLog,
  onClose,
}: WorkoutLogModalProps) {
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const [leftReps, setLeftReps] = useState("");
  const [rightReps, setRightReps] = useState("");

  useEffect(() => {
    if (visible) {
      setWeight(initialWeight != null ? String(initialWeight) : "");
      setReps(initialReps != null ? String(initialReps) : "");
      setLeftReps(initialLeftReps != null ? String(initialLeftReps) : "");
      setRightReps(initialRightReps != null ? String(initialRightReps) : "");
    }
  }, [visible, initialWeight, initialReps, initialLeftReps, initialRightReps]);

  const canLog = isUnilateral
    ? weight.trim() !== "" && leftReps.trim() !== "" && rightReps.trim() !== ""
    : weight.trim() !== "" && reps.trim() !== "";

  const reset = () => {
    setWeight("");
    setReps("");
    setLeftReps("");
    setRightReps("");
  };

  const handleLog = () => {
    const w = parseFloat(weight);
    if (isNaN(w)) return;
    if (isUnilateral) {
      const l = parseInt(leftReps, 10);
      const r = parseInt(rightReps, 10);
      if (isNaN(l) || isNaN(r)) return;
      onLog(w, null, l, r);
    } else {
      const r = parseInt(reps, 10);
      if (isNaN(r)) return;
      onLog(w, r, null, null);
    }
    reset();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.overlay}
      >
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={handleClose}
        />
        <View style={styles.sheet}>
          {/* Handle bar */}
          <View style={styles.handle} />

          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.exerciseName}>{exerciseName}</Text>
              <Text style={styles.setInfo}>
                {mode === "edit"
                  ? `Edit set ${setNumber} of ${totalSets}`
                  : `Set ${setNumber} of ${totalSets} · Target: ${targetReps} reps`}
              </Text>
            </View>
            <TouchableOpacity onPress={handleClose}>
              <Ionicons name="close-circle" size={28} color="#444" />
            </TouchableOpacity>
          </View>

          {/* Inputs */}
          <View style={styles.inputRow}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>WEIGHT (LB)</Text>
              <TextInput
                style={styles.input}
                value={weight}
                onChangeText={(t) => setWeight(t.replace(/[^0-9.]/g, ""))}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor="#444"
                selectionColor={ACCENT}
                autoFocus
              />
            </View>
            {isUnilateral ? (
              <>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>LEFT REPS</Text>
                  <TextInput
                    style={styles.input}
                    value={leftReps}
                    onChangeText={(t) => setLeftReps(t.replace(/[^0-9]/g, ""))}
                    keyboardType="number-pad"
                    placeholder="0"
                    placeholderTextColor="#444"
                    selectionColor={ACCENT}
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>RIGHT REPS</Text>
                  <TextInput
                    style={styles.input}
                    value={rightReps}
                    onChangeText={(t) => setRightReps(t.replace(/[^0-9]/g, ""))}
                    keyboardType="number-pad"
                    placeholder="0"
                    placeholderTextColor="#444"
                    selectionColor={ACCENT}
                  />
                </View>
              </>
            ) : (
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>REPS</Text>
                <TextInput
                  style={styles.input}
                  value={reps}
                  onChangeText={(t) => setReps(t.replace(/[^0-9]/g, ""))}
                  keyboardType="number-pad"
                  placeholder="0"
                  placeholderTextColor="#444"
                  selectionColor={ACCENT}
                />
              </View>
            )}
          </View>

          {/* Log Button */}
          <TouchableOpacity
            activeOpacity={0.85}
            disabled={!canLog}
            onPress={handleLog}
            style={[styles.logButton, !canLog && styles.logButtonDisabled]}
          >
            <Ionicons
              name="checkmark-circle"
              size={22}
              color={canLog ? "#0a0a0a" : "#666"}
            />
            <Text
              style={[
                styles.logButtonText,
                !canLog && styles.logButtonTextDisabled,
              ]}
            >
              {mode === "edit" ? `Update Set ${setNumber}` : `Log Set ${setNumber}`}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  sheet: {
    backgroundColor: "#1a1a1a",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 40,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#444",
    alignSelf: "center",
    marginBottom: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  exerciseName: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Inter_700Bold",
  },
  setInfo: {
    color: "#888",
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    marginTop: 4,
  },
  inputRow: {
    flexDirection: "row",
    gap: 14,
    marginBottom: 20,
  },
  inputGroup: {
    flex: 1,
  },
  inputLabel: {
    color: "#666",
    fontSize: 10,
    fontFamily: "Inter_700Bold",
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#0f0f0f",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    paddingHorizontal: 16,
    paddingVertical: 16,
    color: "#fff",
    fontSize: 24,
    fontFamily: "Inter_700Bold",
    textAlign: "center",
  },
  logButton: {
    backgroundColor: ACCENT,
    borderRadius: 16,
    paddingVertical: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  logButtonDisabled: {
    backgroundColor: "#2a2a2a",
  },
  logButtonText: {
    color: "#0a0a0a",
    fontSize: 17,
    fontFamily: "Inter_700Bold",
  },
  logButtonTextDisabled: {
    color: "#666",
  },
});
