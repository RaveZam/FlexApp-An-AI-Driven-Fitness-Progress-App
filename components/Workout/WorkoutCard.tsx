import { Image, View } from "react-native";
import { ThemedText } from "../ThemedText";

export default function WorkoutCard({
  workout,
  reps,
}: {
  workout: string;
  reps: string;
}) {
  return (
    <View className="flex-row rounded-[28px] bg-[#191818] overflow-hidden mt-4">
      <Image
        source={require("../../assets/images/WorkoutImages/latpulldownimage.webp")}
        style={{
          width: 150,
          height: "auto",
          objectFit: "contain",
        }}
      />
      <View className="flex-1 justify-center items-center py-4">
        <ThemedText className=" font-medium opacity-90">{workout}</ThemedText>
        <ThemedText className="text-[0.8rem] opacity-50">{reps}</ThemedText>
      </View>
    </View>
  );
}
