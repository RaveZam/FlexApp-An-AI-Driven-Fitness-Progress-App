import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import WheelPickerExpo from "react-native-wheel-picker-expo";
import Checkbox from "expo-checkbox";

import { useWorkoutPlanCreator } from "@/hooks/useWorkoutPlanCreator";
import Button from "@/components/ui/Button";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import CheckBox from "@/components/ui/CheckBox";
import LoadingOverlay from "@/components/ui/LoadingOverlay";
export default function index() {
  const Days = "1,2,3,4,5,6,7".split(",");
  const DaysOfTheWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const [step, setStep] = useState(0);
  const [selectedRestDays, setSelectedRestDays] = useState<string[]>([]);
  const [index, setIndex] = useState(0);

  const { setWorkoutNumberOfDays } = useWorkoutPlanCreator();

  return (
    <ThemedView className="flex-1 items-center justify-center">
      {step === 0 ? (
        <>
          <ThemedText>How Many Days Per Week Will You Work Out?</ThemedText>
          <WheelPickerExpo
            height={300}
            width={150}
            initialSelectedIndex={3}
            items={Days.map((name) => ({ label: name, value: "" }))}
            onChange={({ item }) => setWorkoutNumberOfDays(item.value)}
            backgroundColor="#0F0F0F"
            haptics={true}
          />
        </>
      ) : step === 1 ? (
        <>
          <ThemedText className="text-2xl font-medium text-nowrap">
            What Days Do You Want To Rest?
          </ThemedText>
          <View className="my-4 flex-col">
            {DaysOfTheWeek.map((day) => (
              <View className="m-4 flex-row items-center" key={day}>
                <CheckBox
                  label={day}
                  checked={selectedRestDays.includes(day)}
                  onToggle={() => {
                    if (selectedRestDays.includes(day)) {
                      setSelectedRestDays((prev) =>
                        prev.filter((d) => d !== day)
                      );
                    } else {
                      setSelectedRestDays((prev) => [...prev, day]);
                    }
                  }}
                />
              </View>
            ))}
          </View>
        </>
      ) : null}

      <LoadingOverlay isVisible={false} />
      <Button
        className="w-[80%]"
        buttonText="Next"
        onPress={() => {
          setStep(step + 1);
          console.log(step);
        }}
      />
    </ThemedView>
  );
}
