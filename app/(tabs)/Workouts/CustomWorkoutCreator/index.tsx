import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import WheelPickerExpo from "react-native-wheel-picker-expo";

import Button from "@/components/ui/Button";
import CheckBox from "@/components/ui/CheckBox";
import { IconSymbol } from "@/components/ui/IconSymbol";
import LoadingOverlay from "@/components/ui/LoadingOverlay";
import { useState } from "react";
import { Text, TextInput, View } from "react-native";

import GlassButton from "@/components/ui/GlassButton";
import { useWorkoutContext } from "@/hooks/useWorkoutPlanContext";
import { useRestDays } from "@/hooks/useRestDays";
import { DaysOfTheWeek } from "@/constants/WorkoutConstants";
import { useAddWorkoutDayNames } from "@/hooks/WorkoutHooks/useAddWorkoutDayNames";
export default function index() {
  const [isVisible, setisVisible] = useState(false);
  const Days = "1,2,3,4,5,6,7".split(",");

  const [step, setStep] = useState(0);

  const {
    setWorkoutNumberOfDays,
    restDays,
    workoutNumberOfDays,
    workoutDays,
    workoutDaysIndex,
    dayInput,
    setdayInput,
  } = useWorkoutContext();

  const { addDayNameHandler } = useAddWorkoutDayNames();

  const { toggleRestDay } = useRestDays();

  const [inputTouched, setInputTouched] = useState(false);

  return (
    <ThemedView className="flex-1 items-center justify-center">
      {step === 0 ? (
        <>
          <ThemedText>How Many Days Per Week Will You Work Out?</ThemedText>
          <WheelPickerExpo
            height={300}
            width={150}
            initialSelectedIndex={3}
            items={Days.map((name) => ({ label: name, value: Number(name) }))}
            onChange={({ item }) => setWorkoutNumberOfDays(item.value)}
            backgroundColor="#0F0F0F"
            haptics={true}
          />
        </>
      ) : step === 1 ? (
        <View className="flex-1 justify-center items-center w-full px-4">
          <View className="w-full max-w-md bg-[#191919] rounded-2xl shadow-xl border border-[#1a472a]/10 p-8 items-center">
            <ThemedText className="text-2xl font-semibold mb-4 text-center">
              Select Your Rest Days
            </ThemedText>
            <Text className="text-gray-400 text-base mb-8 text-center">
              Choose which days you want to take off from working out.
            </Text>
            <Text className="text-gray-300 text-base mb-4 text-center">
              You have{" "}
              <Text className="text-emerald-400 font-semibold">
                {7 - workoutNumberOfDays}
              </Text>{" "}
              rest days.
            </Text>
            <View className="w-full flex-col gap-2">
              {DaysOfTheWeek.map((day: string) => (
                <View className="flex-row items-center mb-2" key={day}>
                  <CheckBox
                    label={day}
                    checked={restDays.includes(day)}
                    onToggle={() => {
                      toggleRestDay(day);
                    }}
                  />
                </View>
              ))}
            </View>
          </View>
        </View>
      ) : step === 2 ? (
        <View className="flex-1 justify-center items-center w-full px-4">
          <View className="w-full max-w-md bg-[#191919] rounded-2xl shadow-xl border border-[#1a472a]/10 p-8 items-center">
            <ThemedText className="text-2xl font-semibold mb-4 text-center">
              Name Your Workout
            </ThemedText>
            <Text className="text-gray-400 text-base mb-8 text-center">
              Give your{" "}
              <Text className="text-emerald-400 font-semibold">
                {workoutDays[workoutDaysIndex]}
              </Text>{" "}
              workout a unique name.
            </Text>
            <View className="w-full my-4">
              <Text className="text-gray-300 mb-2 ml-1 text-sm">
                Workout Name
              </Text>
              <TextInput
                value={dayInput}
                onSubmitEditing={() => addDayNameHandler(dayInput)}
                onChangeText={(text) => {
                  setdayInput(text);
                  if (!inputTouched) setInputTouched(true);
                }}
                placeholder={`E.g. Push Day, Cardio Blast, Strength Builder`}
                placeholderTextColor="#6b7280"
                className="border-b border-emerald-700 text-white text-lg px-4 py-3 bg-transparent focus:outline-none focus:border-emerald-400 transition-colors duration-200"
                autoFocus
                maxLength={32}
              />
            </View>
            {inputTouched && dayInput === "" && (
              <Text className="text-red-400 text-xs mt-1 mb-3">
                Please enter a name to continue.
              </Text>
            )}
            <GlassButton
              onPress={() => addDayNameHandler(dayInput)}
              accessibilityLabel="Next Day"
              className="mt-8"
            >
              <IconSymbol name="arrow.right" size={32} color="#fff" />
            </GlassButton>
          </View>
        </View>
      ) : null}

      <LoadingOverlay isVisible={isVisible} />
      {step !== 2 ? (
        <>
          <Button
            className="w-[80%]"
            buttonText="Next"
            onPress={() => {
              setStep(step + 1);
              console.log(step);
            }}
          />
        </>
      ) : null}
    </ThemedView>
  );
}
