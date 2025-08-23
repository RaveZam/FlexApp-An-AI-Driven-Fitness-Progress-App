import { Colors } from "@/constants";
import { Feather } from "@expo/vector-icons";
import { Dimensions } from "react-native";
import * as Progress from "react-native-progress";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";

export function WeeklyVolume() {
  return (
    <ThemedView borderToken="border" className="mx-4 p-4 rounded-lg">
      <ThemedView className="flex-row items-center justify-between">
        <ThemedText>Weekly Volume</ThemedText>
        <Feather name="trending-up" size={16} color={Colors.light.text} />
      </ThemedView>
      <ThemedView className="flex-row items-center justify-between">
        <Progress.Bar
          className="my-4"
          progress={0.6}
          width={Dimensions.get("window").width - 110}
          height={10}
          color={Colors.light.text}
          animationConfig={{
            bounciness: 1,
          }}
        />
        <ThemedText>66%</ThemedText>
      </ThemedView>
      <ThemedView className="flex-row items-center justify-between">
        <ThemedText type="subtitle">47,250 lbs of 60,000 lbs goal</ThemedText>
      </ThemedView>
    </ThemedView>
  );
}
