import { Text, TouchableOpacity } from "react-native";

export default function Button({
  buttonText,
  onPress,
  className,
}: {
  buttonText: string;
  onPress: () => void;
  className: string;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`px-6 py-4 rounded-md m-4 bg-emerald-800  overflow-hidden ${className}`}
    >
      <Text className="text-white opacity-90 text-base text-center tracking-wide font-medium">
        {buttonText}
      </Text>
    </TouchableOpacity>
  );
}
