import { ThemedText } from "@/components/ThemedText";
import Button from "@/components/ui/Button";
import { Colors } from "@/constants/Colors";
import React from "react";
import { Modal, Text, View } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { ThemedView } from "../ThemedView";

interface RestTimerOverlayProps {
  visible: boolean;
  exerciseName: string;
  restTime: number;
  onClose: () => void;
  handleStartNextSet: () => void;
  isFinished: boolean;
}

export default function RestTimerOverlay({
  visible,
  exerciseName,
  restTime,
  onClose,
  handleStartNextSet,
  isFinished,
}: RestTimerOverlayProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const progressPercentage = ((180 - restTime) / 180) * 100;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <ThemedView
        colorToken={"background"}
        className="flex-1 bg-black justify-center items-center"
      >
        <View className="flex-1 justify-center items-center w-full">
          <ThemedText className="text-whiteText text-3xl font-bold text-center mb-8">
            Rest Time
          </ThemedText>

          {/* Animated Circular Progress */}
          <View className="relative items-center justify-center mb-8">
            {/* Outer rotating ring */}
            <AnimatedCircularProgress
              size={200}
              width={16}
              fill={progressPercentage} // 0 to 100
              tintColor={Colors.light.primary}
              backgroundColor="#e5e7eb"
              duration={1000}
            />

            {/* Timer text */}
            <View className="absolute items-center justify-center">
              <Text className="text-whiteText text-5xl font-bold">
                {formatTime(restTime)}
              </Text>
            </View>
          </View>

          <ThemedText className="text-mutedText text-center mb-8 text-lg">
            Next: {exerciseName}
          </ThemedText>

          <Button
            buttonText={isFinished ? "Next Exercise" : "Start Next Set"}
            onPress={handleStartNextSet}
            className=""
          />
        </View>
      </ThemedView>
    </Modal>
  );
}
