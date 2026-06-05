import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

export function WorkoutDetailHeader({
  title,
  editing,
  onBack,
  onToggleEdit,
}: {
  title: string;
  editing: boolean;
  onBack: () => void;
  onToggleEdit: () => void;
}) {
  return (
    <View
      style={{
        paddingHorizontal: 20,
        paddingTop: 8,
        paddingBottom: 16,
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <TouchableOpacity
        onPress={onBack}
        activeOpacity={0.7}
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          backgroundColor: "#191919",
          alignItems: "center",
          justifyContent: "center",
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.06)",
        }}
      >
        <Ionicons name={editing ? "close" : "chevron-back"} size={20} color="#aaa" />
      </TouchableOpacity>

      <View style={{ flex: 1, alignItems: "center" }}>
        <Text
          style={{
            color: "#ffffff",
            fontSize: 18,
            fontFamily: "Inter_600SemiBold",
            letterSpacing: -0.3,
          }}
          numberOfLines={1}
        >
          {title}
        </Text>
      </View>

      <TouchableOpacity
        onPress={onToggleEdit}
        activeOpacity={0.7}
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          backgroundColor: editing ? "rgba(16,185,129,0.15)" : "#191919",
          alignItems: "center",
          justifyContent: "center",
          borderWidth: 1,
          borderColor: editing ? "rgba(16,185,129,0.4)" : "rgba(255,255,255,0.06)",
        }}
      >
        <Ionicons name={editing ? "checkmark" : "pencil"} size={16} color={editing ? "#10b981" : "#aaa"} />
      </TouchableOpacity>
    </View>
  );
}
