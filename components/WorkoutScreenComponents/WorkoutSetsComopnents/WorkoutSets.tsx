import { ThemedText } from "@/components/ThemedText";
import React from "react";
import { ScrollView, Text, View } from "react-native";
import HistoryCard from "../PersonalRecordAndHistoryComponents/HistoryCard";
import PersonalRecordsCard from "../PersonalRecordAndHistoryComponents/PersonalRecordsCard";
import SelectedWorkoutCard from "../SelectedWorkoutCard";

export default function WorkoutSets({
  workoutLog,
  currentSet,
  selectedExercise,
}: {
  workoutLog: any;
  currentSet: number;
  selectedExercise: any;
}) {
  return (
    <ScrollView className="flex-1 " showsVerticalScrollIndicator={false}>
      <View className="bg-lightDark p-4">
        <SelectedWorkoutCard displayExercise={selectedExercise} />

        {/* Personal Record and History */}
        <View className="flex-row justify-around w-full m-4 ">
          <PersonalRecordsCard />
          <HistoryCard />
        </View>
      </View>

      {/* Workout Sets */}
      <View className="m-4">
        <ThemedText className="text-whiteText text-lg font-medium mb-3">
          Sets
        </ThemedText>

        {/* Previous Sets */}
        {workoutLog.map((set: any, index: any) => (
          <View
            key={index}
            className="flex-row items-center bg-lightDark rounded-2xl p-4 mb-2"
          >
            <View className="flex-row items-center justify-center min-w-24">
              <Text className="text-whiteText font-medium">{set.weight}lb</Text>
            </View>
            <View className="w-px h-6 bg-mutedText mx-4" />
            <View className="flex-row items-center justify-center min-w-24">
              <Text className="text-whiteText font-medium">
                {set.reps} Reps
              </Text>
            </View>
            <View className="w-px h-6 bg-mutedText mx-4" />
          </View>
        ))}

        {/* Current Set Input */}
        <View className="flex-row items-center bg-lightDark rounded-2xl p-4 mb-2">
          <View className="flex-row items-center justify-center min-w-24">
            <Text className="text-whiteText font-medium">Set {currentSet}</Text>
          </View>
          <View className="w-px h-6 bg-mutedText mx-4" />
          <View className="flex-row items-center justify-center min-w-24">
            <Text className="text-whiteText font-medium">Input</Text>
          </View>
          <View className="w-px h-6 bg-mutedText mx-4" />
        </View>
      </View>
    </ScrollView>
  );
}
