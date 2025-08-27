import { Colors } from "@/constants/Colors";
import { Text, TouchableOpacity, View } from "react-native";

export default function Button({
  buttonText,
  onPress,
  className,
  disabled = false,
  icon,
}: {
  buttonText: string;
  onPress: () => void;
  className: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={{ backgroundColor: Colors.light.primary }}
      className={`px-6 py-4 rounded-md mx-4 overflow-hidden ${className} ${
        disabled ? "opacity-50" : ""
      }`}
    >
      <View className="flex-row items-center justify-center gap-2">
        {icon && <View>{icon}</View>}

        <Text className="text-white opacity-90 text-base text-center tracking-wide font-medium">
          {buttonText}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
