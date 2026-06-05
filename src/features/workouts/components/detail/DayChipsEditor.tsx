import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useUpdateWorkoutDays } from "../../hooks/useUpdateWorkoutDays";

const DAY_LABELS = ["S", "M", "T", "W", "TH", "F", "S"];

export function DayChipsEditor({
  workoutId,
  initialDays,
  onSaved,
}: {
  workoutId: string;
  initialDays: number[];
  onSaved: () => void;
}) {
  const [days, setDays] = useState<number[]>(initialDays);
  const { saveDays } = useUpdateWorkoutDays();

  useEffect(() => {
    setDays(initialDays);
  }, [workoutId]);

  function toggleDay(day: number) {
    const next = days.includes(day) ? days.filter((d) => d !== day) : [...days, day];
    setDays(next);
    saveDays(workoutId, next);
    onSaved();
  }

  return (
    <View>
      <Text
        style={{
          color: "#666",
          fontSize: 11,
          fontFamily: "Inter_500Medium",
          letterSpacing: 0.8,
          textTransform: "uppercase",
          marginBottom: 10,
        }}
      >
        Days
      </Text>
      <View style={{ flexDirection: "row", gap: 8 }}>
        {DAY_LABELS.map((label, i) => {
          const selected = days.includes(i);
          return (
            <TouchableOpacity
              key={i}
              onPress={() => toggleDay(i)}
              activeOpacity={0.7}
              style={{
                flex: 1,
                aspectRatio: 1,
                borderRadius: 10,
                backgroundColor: selected ? "rgba(16,185,129,0.15)" : "#191919",
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 1,
                borderColor: selected ? "rgba(16,185,129,0.5)" : "rgba(255,255,255,0.06)",
              }}
            >
              <Text
                style={{
                  color: selected ? "#10b981" : "#555",
                  fontSize: 12,
                  fontFamily: selected ? "Inter_600SemiBold" : "Inter_400Regular",
                }}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
