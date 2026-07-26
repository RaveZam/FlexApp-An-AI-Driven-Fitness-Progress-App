import type { CatalogExercise } from "@/src/features/workouts/types";
import { usePalette } from "@/src/theme";
import { Ionicons } from "@expo/vector-icons";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

type Props = {
  index: number;
  catalogExercise: CatalogExercise;
  targetSets: string;
  targetReps: string;
  onChange: (field: "targetSets" | "targetReps", value: string) => void;
  onRemove: () => void;
};

export default function ExerciseEditorRow({
  index,
  catalogExercise,
  targetSets,
  targetReps,
  onChange,
  onRemove,
}: Props) {
  const p = usePalette();
  return (
    <View
      style={{
        backgroundColor: p.inkRaised,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: p.hairline,
        overflow: "hidden",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 14,
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderBottomColor: p.hairline,
          gap: 10,
        }}
      >
        <View
          style={{
            width: 22,
            height: 22,
            borderRadius: 11,
            backgroundColor: p.accentSoft,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ color: p.accent, fontSize: 11, fontFamily: "Inter_600SemiBold" }}>
            {index + 1}
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ color: p.bone, fontSize: 14, fontFamily: "Inter_500Medium" }}>
            {catalogExercise.name}
          </Text>
          {catalogExercise.muscleGroup && (
            <Text
              style={{
                color: p.mutedSoft,
                fontSize: 11,
                fontFamily: "Inter_400Regular",
                marginTop: 2,
                textTransform: "capitalize",
              }}
            >
              {catalogExercise.muscleGroup}
            </Text>
          )}
        </View>
        <TouchableOpacity onPress={onRemove} hitSlop={8}>
          <Ionicons name="trash-outline" size={16} color={p.mutedSoft} />
        </TouchableOpacity>
      </View>

      <View style={{ flexDirection: "row", paddingHorizontal: 14, paddingVertical: 10, gap: 12 }}>
        <NumberCell label="Sets" value={targetSets} onChange={(v) => onChange("targetSets", v)} placeholder="3" />
        <View
          style={{
            width: 1,
            alignSelf: "stretch",
            backgroundColor: p.hairline,
            marginVertical: 4,
          }}
        />
        <NumberCell label="Reps" value={targetReps} onChange={(v) => onChange("targetReps", v)} placeholder="10" />
      </View>
    </View>
  );
}

function NumberCell({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  const p = usePalette();
  return (
    <View style={{ flex: 1, alignItems: "center" }}>
      <Text
        style={{
          color: p.mutedSoft,
          fontSize: 10,
          fontFamily: "Inter_400Regular",
          letterSpacing: 0.5,
          textTransform: "uppercase",
          marginBottom: 6,
        }}
      >
        {label}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        keyboardType="number-pad"
        placeholder={placeholder}
        placeholderTextColor={p.mutedSoft}
        style={{
          backgroundColor: p.inkSunken,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: p.hairline,
          color: p.bone,
          fontFamily: "Inter_600SemiBold",
          fontSize: 16,
          paddingVertical: 8,
          width: "100%",
          textAlign: "center",
        }}
      />
    </View>
  );
}
