import { ThemedText } from "@/components/ThemedText";
import { useGetPersonalRecord } from "@/hooks/useGetPersonalRecord";
import { useWorkoutContext } from "@/hooks/useWorkoutPlanContext";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

export default function PersonalRecordsCard() {
  const { personalRecord } = useGetPersonalRecord();
  const { selectedExercise } = useWorkoutContext();
  const [date, setDate] = useState<Date | null>(null);

  useEffect(() => {
    if (selectedExercise && personalRecord) {
      let date = new Date(personalRecord[0].created_at);
      setDate(date);
    }
  }, [personalRecord, selectedExercise]);

  return (
    <View>
      <ThemedText className="text-mutedText font-medium text-md mb-2">
        Personal Record:
      </ThemedText>
      <View className="">
        <View className="flex-row gap-1">
          <Text className="text-sm text-veryMutedText">Weight:</Text>
          <Text className="text-emerald-500 font-semibold text-sm">
            {personalRecord ? personalRecord[0]?.weight : 0}lb
          </Text>
        </View>
        <View className="flex-row gap-1 ">
          <Text className="text-sm text-veryMutedText">Reps:</Text>
          <Text className="text-sm text-emerald-500">
            {personalRecord ? personalRecord[0]?.reps : 0}
          </Text>
        </View>
        <View className="flex-row ">
          <Text className="text-sm text-mutedText">
            {date?.toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }) || "N/A"}
          </Text>
        </View>
      </View>
    </View>
  );
}
