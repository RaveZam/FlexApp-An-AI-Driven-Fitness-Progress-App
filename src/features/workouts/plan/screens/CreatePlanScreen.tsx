import "@/global.css";
import { usePalette, type Palette } from "@/src/theme";
import { useMemo } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { CreateHeader } from "../../components/CreateHeader";
import { NameField } from "../../components/NameField";
import { useCreatePlan } from "../hooks/useCreatePlan";

export default function CreatePlanScreen() {
  const p = usePalette();
  const styles = useMemo(() => makeStyles(p), [p]);
  const { planName, setPlanName, handleSave, saving } = useCreatePlan();

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <CreateHeader
          title="New Plan"
          actionLabel="Create"
          saving={saving}
          onSave={handleSave}
        />

        <View style={styles.body}>
          <NameField
            label="Plan Name"
            placeholder="e.g. PPL, Upper / Lower, 5-Day Split"
            value={planName}
            onChangeText={setPlanName}
            autoFocus
            onSubmitEditing={handleSave}
          />

          <Animated.View
            entering={FadeInDown.delay(180).duration(350)}
            style={styles.hintWrap}
          >
            <Text style={styles.hint}>
              A plan groups your per-day workouts. After creating the plan, add
              individual days (Push, Pull, Legs, etc.) and assign them to days
              of the week.
            </Text>
          </Animated.View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const makeStyles = (p: Palette) =>
  StyleSheet.create({
    safe: { flex: 1, backgroundColor: p.ink },
    flex: { flex: 1 },
    body: { paddingHorizontal: 20, paddingTop: 8 },
    hintWrap: { marginTop: 20 },
    hint: {
      color: p.mutedSoft,
      fontSize: 12,
      fontFamily: "Inter_400Regular",
      lineHeight: 18,
    },
  });
