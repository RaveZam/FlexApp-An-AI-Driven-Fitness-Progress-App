import { Text, TouchableOpacity } from "react-native";

export default function Button({
  buttonText,
  onPress,
  className,
  disabled = false,
}: {
  buttonText: string;
  onPress: () => void;
  className: string;
  disabled?: boolean;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      className={`px-6 py-4 rounded-md m-4 bg-emerald-800 overflow-hidden ${className} ${
        disabled ? "opacity-50" : ""
      }`}
    >
      <Text className="text-white opacity-90 text-base text-center tracking-wide font-medium">
        {buttonText}
      </Text>
    </TouchableOpacity>
  );
}
