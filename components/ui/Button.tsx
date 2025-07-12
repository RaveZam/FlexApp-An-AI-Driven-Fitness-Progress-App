import { Text, TouchableOpacity } from "react-native";
import Svg, { Defs, LinearGradient, Rect } from "react-native-svg";

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
      className={`px-6 py-4 rounded-md m-4 shadow-md m-1 overflow-hidden ${className}`}
    >
      <Svg
        width="100%"
        height="100%"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      >
        <Defs>
          <LinearGradient id="buttonGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#064e3b" />
            <stop offset="50%" stopColor="#065f46" />
            <stop offset="100%" stopColor="#064e3b" />
          </LinearGradient>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#buttonGradient)" rx={6} />
      </Svg>
      <Text className="text-white opacity-90 text-base text-center tracking-wide font-medium">
        {buttonText}
      </Text>
    </TouchableOpacity>
  );
}
