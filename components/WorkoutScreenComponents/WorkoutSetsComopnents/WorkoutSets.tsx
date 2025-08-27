import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useWorkoutContext } from "@/hooks/useWorkoutPlanContext";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, View } from "react-native";
import HistoryCard from "../PersonalRecordAndHistoryComponents/HistoryCard";
import PersonalRecordsCard from "../PersonalRecordAndHistoryComponents/PersonalRecordsCard";
import SelectedWorkoutCard from "../SelectedWorkoutCard";

export default function WorkoutSets({
  selectedExercise,
  isFinished,
}: {
  selectedExercise: any;
  isFinished: boolean;
}) {
  const { currentSet, workoutLog } = useWorkoutContext();
  return (
    <ScrollView className="flex-1 " showsVerticalScrollIndicator={false}>
      <View className="bg-lightDark p-4">
        <SelectedWorkoutCard displayExercise={selectedExercise} />

        {/* Personal Record and History */}
        <ThemedView
          colorToken={"secondaryBackground"}
          borderToken={"border"}
          borderWidth={1}
          className="flex-row w-full p-4 pb-0 gap-2 rounded-2xl"
        >
          <PersonalRecordsCard />
          <HistoryCard />
        </ThemedView>
      </View>

      {/* Workout Sets */}
      <ThemedView
        colorToken={"secondaryBackground"}
        borderToken={"border"}
        borderWidth={1}
        className="m-4 rounded-2xl p-4"
      >
        <ThemedText className="text-whiteText text-lg font-medium mb-3">
          Sets
        </ThemedText>

        {/* Previous Sets */}
        {workoutLog.map((set: any, index: any) => (
          <ThemedView
            key={index}
            colorToken={"primary"}
            className="flex-row items-center bg-lightDark rounded-lg p-4 mb-2"
          >
            <ThemedView
              colorToken={"primary"}
              className="flex-row items-center justify-center min-w-24"
            >
              <ThemedText
                type="subtitle"
                colorToken={"background"}
                className="font-medium"
              >
                {set.weight}lb
              </ThemedText>
            </ThemedView>
            <ThemedView className="w-px h-6  mx-4" />
            <ThemedView
              colorToken={"primary"}
              className="flex-row items-center justify-center min-w-24"
            >
              <ThemedText
                type="subtitle"
                colorToken={"background"}
                className="font-medium"
              >
                {set.reps} Reps
              </ThemedText>
            </ThemedView>
            <ThemedView className="w-px h-6  mx-4" />
            <ThemedView colorToken={"primary"} className="flex-1 items-center">
              <Ionicons name="checkmark" size={24} color="white" />
            </ThemedView>
          </ThemedView>
        ))}

        {/* Current Set Input */}
        {isFinished ? (
          ""
        ) : (
          <ThemedView
            borderToken={"border"}
            borderWidth={1}
            className="flex-row items-center  rounded-2xl p-4 mb-2"
          >
            <ThemedView className="flex-row items-center justify-center min-w-24">
              <ThemedText type="subtitle" className="font-medium">
                Set {currentSet}
              </ThemedText>
            </ThemedView>
            <ThemedView className="w-px h-6 bg-mutedText mx-4" />
            <ThemedView className="flex-row items-center justify-center min-w-24">
              <ThemedText type="subtitle" className="font-medium">
                Input
              </ThemedText>
            </ThemedView>
            <ThemedView className="w-px h-6 bg-mutedText mx-4" />
          </ThemedView>
        )}
      </ThemedView>
    </ScrollView>
  );
}
