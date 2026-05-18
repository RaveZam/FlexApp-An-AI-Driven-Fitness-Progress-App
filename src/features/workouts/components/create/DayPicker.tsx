import { Text, TouchableOpacity, View } from "react-native";

const DAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

type Props = {
  selected: number[];
  onToggle: (day: number) => void;
};

export default function DayPicker({ selected, onToggle }: Props) {
  return (
    <View style={{ flexDirection: "row", gap: 8 }}>
      {DAY_LABELS.map((label, i) => {
        const isSelected = selected.includes(i);
        return (
          <TouchableOpacity
            key={i}
            onPress={() => onToggle(i)}
            activeOpacity={0.7}
            style={{
              flex: 1,
              aspectRatio: 1,
              borderRadius: 10,
              backgroundColor: isSelected ? "rgba(16,185,129,0.15)" : "#191919",
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 1,
              borderColor: isSelected ? "rgba(16,185,129,0.5)" : "rgba(255,255,255,0.06)",
            }}
          >
            <Text
              style={{
                color: isSelected ? "#10b981" : "#555",
                fontSize: 12,
                fontFamily: isSelected ? "Inter_600SemiBold" : "Inter_400Regular",
              }}
            >
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
