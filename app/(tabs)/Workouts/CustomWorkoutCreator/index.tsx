import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import WheelPickerExpo from "react-native-wheel-picker-expo";

import Button from "@/components/ui/Button";
import CheckBox from "@/components/ui/CheckBox";
import LoadingOverlay from "@/components/ui/LoadingOverlay";
import { useWorkoutPlanCreator } from "@/hooks/useWorkoutPlanCreator";
import { useEffect, useState } from "react";
import { Text, TextInput, View } from "react-native";
export default function index() {
  const [isVisible, setisVisible] = useState(false);
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

  const [step, setStep] = useState(2);

  const { setWorkoutNumberOfDays, restDays, setRestDays, workoutNumberOfDays } =
    useWorkoutPlanCreator();

  // const workoutDays = DaysOfTheWeek.filter((day) => !restDays.includes(day));
  const workoutDays = ["Monday", "Tuesday", "Wednesday"];

  const [workoutDaysIndex, setWorkoutDaysIndex] = useState(0);

  const [workoutDayNames, setworkoutDayNames] = useState<string[]>([]);
  const [dayInput, setdayInput] = useState("");

  const [workoutPlan, setWorkoutPlan] = useState<any>([]);

  useEffect(() => {
    console.log(workoutPlan);
  }, [workoutPlan]);

  const getInitialWorkoutPlan = (steps: any[]) => {
    return {
      workoutPlan: steps.map((step) => ({
        key: step.day,
        workouts: [],
      })),
    };
  };

  useEffect(() => {
    const customWorkoutPlan = workoutDayNames.map((day) => ({
      day: day,
      key: day.toLowerCase().replace(/\s+/g, "-"),
    }));

    setWorkoutPlan(getInitialWorkoutPlan(customWorkoutPlan));
  }, [workoutDayNames]);

  const handleNext = () => {
    if (!dayInput) {
      return;
    }

    if (workoutDays.length - 1 >= workoutDaysIndex) {
      setworkoutDayNames((prev) => [...prev, dayInput]);
      setdayInput("");
      setWorkoutDaysIndex((prev) => prev + 1);
      return;
    } else {
      setdayInput("");
      // setisVisible(true);
    }
  };

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
        <>
          <ThemedText className="text-2xl font-medium text-nowrap">
            What Days Do You Want To Rest?
          </ThemedText>
          <Text className="text-gray-300 text-lg opacity-80  mt-4">
            You Have {7 - workoutNumberOfDays} Rest Days
          </Text>
          <View className="my-4 flex-col">
            {DaysOfTheWeek.map((day) => (
              <View className="m-4 flex-row items-center" key={day}>
                <CheckBox
                  label={day}
                  checked={restDays.includes(day)}
                  onToggle={() => {
                    if (7 - workoutNumberOfDays > restDays.length) {
                      setRestDays((prev) => [...prev, day]);
                    }

                    if (restDays.includes(day)) {
                      setRestDays((prev) => prev.filter((d) => d !== day));
                    }
                  }}
                />
              </View>
            ))}
          </View>
        </>
      ) : step === 2 ? (
        <View className="flex-1 justify-center items-center">
          <ThemedText className="text-[1.2rem]">
            What Do You Wanna Call {workoutDays[workoutDaysIndex]}'s Workout?
          </ThemedText>

          <TextInput
            value={dayInput}
            onSubmitEditing={() => handleNext()}
            onChangeText={(text) => setdayInput(text)}
            className="border-b border-[#464646] text-white text-[1.2rem] px-4 py-3 mt-4 mb-4 focus:outline-none focus:ring-0"
          />
          <Button
            className="w-3/4 mt-12"
            buttonText="Next Day"
            onPress={() => handleNext()}
          />
          <Button
            className="w-[80%]"
            buttonText="Next"
            onPress={() => {
              console.log(workoutPlan);
            }}
          />
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

//  make it inrement per day of the index on working day
//  save the names of each day
//  so we will create a new array with the structure of

//  [
//     push : [],
//     pull: [],
//     legs: [],
//     arms: []''
//  ]

//  or something like that, and the we need to pass that in the creator in the workout plan so it can run to the workout plan creator screen and then be able to save in supabase
