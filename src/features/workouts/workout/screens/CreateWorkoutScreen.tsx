import "@/global.css";
import { usePalette, type Palette } from "@/src/theme";
import { useMemo } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CreateHeader } from "../../components/CreateHeader";
import { NameField } from "../../components/NameField";
import { CreateWorkoutExercises } from "../components/CreateWorkoutExercises";
import { ExercisePickerModal } from "../components/ExercisePickerModal";
import { WorkoutDaysField } from "../components/WorkoutDaysField";
import { useCreateWorkoutScreen } from "../hooks/useCreateWorkoutScreen";

export default function CreateWorkoutScreen() {
  const p = usePalette();
  const styles = useMemo(() => makeStyles(p), [p]);
  const { form } = useCreateWorkoutScreen();

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <CreateHeader
          title="New Workout"
          actionLabel="Save"
          saving={form.saving}
          onSave={form.actions.save}
        />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <NameField
            label="Workout Name"
            placeholder="e.g. Push Day, Legs"
            value={form.name}
            onChangeText={form.actions.setName}
          />

          <WorkoutDaysField
            selected={form.daysOfWeek}
            onToggle={form.actions.toggleDay}
          />

          <CreateWorkoutExercises
            exercises={form.exercises}
            onChange={form.actions.changeExercise}
            onRemove={form.actions.removeExercise}
            onAddExercise={form.actions.openPicker}
          />
        </ScrollView>
      </KeyboardAvoidingView>

      <ExercisePickerModal
        visible={form.pickerVisible}
        onSelect={form.actions.addExercise}
        onClose={form.actions.closePicker}
      />
    </SafeAreaView>
  );
}

const makeStyles = (p: Palette) =>
  StyleSheet.create({
    safe: { flex: 1, backgroundColor: p.ink },
    flex: { flex: 1 },
    scrollContent: {
      paddingHorizontal: 20,
      paddingBottom: 40,
      gap: 24,
    },
  });
