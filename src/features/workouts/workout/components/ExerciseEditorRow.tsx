import type { CatalogExercise } from "@/src/features/workouts/types";
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
  return (
    <View
      style={{
        backgroundColor: "#191919",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.05)",
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
          borderBottomColor: "rgba(255,255,255,0.04)",
          gap: 10,
        }}
      >
        <View
          style={{
            width: 22,
            height: 22,
            borderRadius: 11,
            backgroundColor: "rgba(16,185,129,0.12)",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ color: "#10b981", fontSize: 11, fontFamily: "Inter_600SemiBold" }}>
            {index + 1}
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ color: "#fff", fontSize: 14, fontFamily: "Inter_500Medium" }}>
            {catalogExercise.name}
          </Text>
          {catalogExercise.muscleGroup && (
            <Text
              style={{
                color: "#555",
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
          <Ionicons name="trash-outline" size={16} color="#444" />
        </TouchableOpacity>
      </View>

      <View style={{ flexDirection: "row", paddingHorizontal: 14, paddingVertical: 10, gap: 12 }}>
        <NumberCell label="Sets" value={targetSets} onChange={(v) => onChange("targetSets", v)} placeholder="3" />
        <View
          style={{
            width: 1,
            alignSelf: "stretch",
            backgroundColor: "rgba(255,255,255,0.04)",
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
  return (
    <View style={{ flex: 1, alignItems: "center" }}>
      <Text
        style={{
          color: "#555",
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
        placeholderTextColor="#444"
        style={{
          backgroundColor: "#111",
          borderRadius: 8,
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.06)",
          color: "#fff",
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
