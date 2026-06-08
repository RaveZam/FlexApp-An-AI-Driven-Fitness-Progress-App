import "@/global.css";
import DayPicker from "@/src/features/workouts/components/create/DayPicker";
import ExerciseEditorRow from "@/src/features/workouts/components/create/ExerciseEditorRow";
import { ExercisePickerModal } from "@/src/features/workouts/components/create/ExercisePickerModal";
import { useCreateWorkoutForm } from "@/src/features/workouts/hooks/useCreateWorkoutForm";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown, FadeInRight } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CreateWorkoutScreen() {
  const router = useRouter();
  const { planId } = useLocalSearchParams<{ planId: string }>();
  const form = useCreateWorkoutForm(planId, () => router.back());
  const [pickerVisible, setPickerVisible] = useState(false);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0f0f0f" }} edges={["top"]}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <Animated.View entering={FadeInDown.delay(50).duration(350)} style={styles.header}>
          <View style={{ flex: 1 }}>
            <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7} hitSlop={8}>
              <Ionicons name="chevron-back" size={24} color="#888" />
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1, alignItems: "center" }}>
            <Text style={styles.title}>New Workout</Text>
          </View>
          <View style={{ flex: 1, alignItems: "flex-end" }}>
            <TouchableOpacity
              onPress={form.save}
              disabled={form.saving}
              activeOpacity={0.7}
              style={[styles.saveBtn, { backgroundColor: form.saving ? "#1a3326" : "#1a472a" }]}
            >
              <Text style={[styles.saveText, { color: form.saving ? "#555" : "#10b981" }]}>
                {form.saving ? "Saving…" : "Save"}
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40, gap: 24 }}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View entering={FadeInDown.delay(100).duration(350)}>
            <Text style={styles.label}>Workout Name</Text>
            <TextInput
              value={form.workoutName}
              onChangeText={form.setWorkoutName}
              placeholder="e.g. Push Day, Legs"
              placeholderTextColor="#333"
              style={styles.nameInput}
            />
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(140).duration(350)}>
            <Text style={[styles.label, { marginBottom: 10 }]}>Days</Text>
            <DayPicker selected={form.daysOfWeek} onToggle={form.toggleDay} />
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(180).duration(350)}>
            <View style={styles.exercisesHeader}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <View style={{ width: 4, height: 18, borderRadius: 2, backgroundColor: "#10b981" }} />
                <Text style={styles.sectionTitle}>Exercises</Text>
              </View>
              {form.exercises.length > 0 && (
                <Text style={{ color: "#444", fontSize: 12, fontFamily: "Inter_400Regular" }}>
                  {form.exercises.length} added
                </Text>
              )}
            </View>

            <View style={{ gap: 10 }}>
              {form.exercises.map((row, index) => (
                <Animated.View key={row.key} entering={FadeInRight.delay(index * 50).duration(400)}>
                  <ExerciseEditorRow
                    index={index}
                    catalogExercise={row.catalogExercise}
                    targetSets={row.targetSets}
                    targetReps={row.targetReps}
                    onChange={(field, v) => form.changeExercise(row.key, field, v)}
                    onRemove={() => form.removeExercise(row.key)}
                  />
                </Animated.View>
              ))}
            </View>

            <TouchableOpacity
              onPress={() => setPickerVisible(true)}
              activeOpacity={0.7}
              style={[styles.addBtn, { marginTop: form.exercises.length > 0 ? 12 : 0 }]}
            >
              <Ionicons name="add" size={16} color="#10b981" />
              <Text style={styles.addText}>Add Exercise</Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>

      <ExercisePickerModal
        visible={pickerVisible}
        onSelect={form.addExercise}
        onClose={() => setPickerVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = {
  header: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  title: { color: "#fff", fontSize: 18, fontFamily: "Inter_600SemiBold", letterSpacing: -0.3 },
  saveBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(16,185,129,0.2)",
  },
  saveText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  label: {
    color: "#666",
    fontSize: 11,
    fontFamily: "Inter_500Medium",
    letterSpacing: 0.8,
    textTransform: "uppercase" as const,
    marginBottom: 8,
  },
  nameInput: {
    backgroundColor: "#191919",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    color: "#fff",
    fontFamily: "Inter_500Medium",
    fontSize: 16,
    padding: 14,
  },
  exercisesHeader: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "space-between" as const,
    marginBottom: 12,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    letterSpacing: 0.8,
    textTransform: "uppercase" as const,
  },
  addBtn: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    gap: 6,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(16,185,129,0.2)",
    borderStyle: "dashed" as const,
  },
  addText: { color: "#10b981", fontSize: 13, fontFamily: "Inter_500Medium", letterSpacing: 0.3 },
};
