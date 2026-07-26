import { usePalette, type Palette } from "@/src/theme";
import { Ionicons } from "@expo/vector-icons";
import React, { useMemo } from "react";
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
import { useWorkoutLogForm } from "../hooks/useWorkoutLogForm";

type WorkoutLogModalProps = {
  visible: boolean;
  onClose: () => void;
  onLogged: () => void;
};

export default function WorkoutLogModal({
  visible,
  onClose,
  onLogged,
}: WorkoutLogModalProps) {
  const p = usePalette();
  const styles = useMemo(() => makeStyles(p), [p]);
  const { exercise, inputs, onChange, canLog, handleLog, handleClose } =
    useWorkoutLogForm(visible, { onClose, onLogged });

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
              <Text style={styles.exerciseName}>{exercise.name}</Text>
              <Text style={styles.setInfo}>
                {`Set ${exercise.setNumber} of ${exercise.totalSets} · Target: ${exercise.targetReps} reps`}
              </Text>
            </View>
            <TouchableOpacity onPress={handleClose}>
              <Ionicons name="close-circle" size={28} color={p.mutedSoft} />
            </TouchableOpacity>
          </View>

          {/* Inputs */}
          <View style={styles.inputRow}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>WEIGHT (LB)</Text>
              <TextInput
                style={styles.input}
                value={inputs.weight}
                onChangeText={onChange.weight}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor={p.mutedSoft}
                selectionColor={p.accent}
                autoFocus
              />
            </View>
            {exercise.isUnilateral ? (
              <>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>LEFT REPS</Text>
                  <TextInput
                    style={styles.input}
                    value={inputs.leftReps}
                    onChangeText={onChange.leftReps}
                    keyboardType="number-pad"
                    placeholder="0"
                    placeholderTextColor={p.mutedSoft}
                    selectionColor={p.accent}
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>RIGHT REPS</Text>
                  <TextInput
                    style={styles.input}
                    value={inputs.rightReps}
                    onChangeText={onChange.rightReps}
                    keyboardType="number-pad"
                    placeholder="0"
                    placeholderTextColor={p.mutedSoft}
                    selectionColor={p.accent}
                  />
                </View>
              </>
            ) : (
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>REPS</Text>
                <TextInput
                  style={styles.input}
                  value={inputs.reps}
                  onChangeText={onChange.reps}
                  keyboardType="number-pad"
                  placeholder="0"
                  placeholderTextColor={p.mutedSoft}
                  selectionColor={p.accent}
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
              color={canLog ? p.onAccent : p.muted}
            />
            <Text
              style={[
                styles.logButtonText,
                !canLog && styles.logButtonTextDisabled,
              ]}
            >
              {`Log Set ${exercise.setNumber}`}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const makeStyles = (p: Palette) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      justifyContent: "flex-end",
    },
    backdrop: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.6)",
    },
    sheet: {
      backgroundColor: p.inkRaised,
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
      backgroundColor: p.mutedSoft,
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
      color: p.bone,
      fontSize: 18,
      fontFamily: "Inter_700Bold",
    },
    setInfo: {
      color: p.muted,
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
      color: p.muted,
      fontSize: 10,
      fontFamily: "Inter_700Bold",
      letterSpacing: 1.5,
      marginBottom: 8,
    },
    input: {
      backgroundColor: p.inkSunken,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: p.hairline,
      paddingHorizontal: 16,
      paddingVertical: 16,
      color: p.bone,
      fontSize: 24,
      fontFamily: "Inter_700Bold",
      textAlign: "center",
    },
    logButton: {
      backgroundColor: p.accent,
      borderRadius: 16,
      paddingVertical: 18,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
    },
    logButtonDisabled: {
      backgroundColor: p.mutedSoft,
    },
    logButtonText: {
      color: p.onAccent,
      fontSize: 17,
      fontFamily: "Inter_700Bold",
    },
    logButtonTextDisabled: {
      color: p.muted,
    },
  });
