import { Text, TouchableOpacity } from "react-native";

export default function Button({
  buttonText,
  onPress,
}: {
  buttonText: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-[#BFFA00] m-4 p-4 rounded-full mt-auto box-shadow"
    >
      <Text className="text-center text-black text-lg font-semibold">
        {buttonText}
      </Text>
    </TouchableOpacity>
  );
}
