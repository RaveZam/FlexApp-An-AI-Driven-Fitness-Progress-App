import { usePalette } from "@/src/theme";
import { Text, TouchableOpacity, View } from "react-native";
import { DAY_LABELS } from "../../dayLabels";

type Props = {
  selected: number[];
  onToggle: (day: number) => void;
};

export default function DayPicker({ selected, onToggle }: Props) {
  const p = usePalette();
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
              backgroundColor: isSelected ? p.accentSoft : p.inkRaised,
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 1,
              borderColor: isSelected ? p.accentBorder : p.hairline,
            }}
          >
            <Text
              style={{
                color: isSelected ? p.accent : p.mutedSoft,
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
