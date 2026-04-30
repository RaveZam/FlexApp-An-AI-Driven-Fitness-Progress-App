import Fontisto from "@expo/vector-icons/Fontisto";
import { useEffect } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";

export default function UserInfoCard() {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(-8);

  useEffect(() => {
    opacity.value = withDelay(30, withTiming(1, { duration: 350 }));
    translateY.value = withDelay(
      30,
      withSpring(0, { damping: 22, stiffness: 220 })
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 20,
          paddingVertical: 14,
          backgroundColor: "#0f0f0f",
          borderBottomWidth: 1,
          borderBottomColor: "rgba(255,255,255,0.04)",
        },
        animatedStyle,
      ]}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Image
          style={{ width: 40, height: 40, borderRadius: 10 }}
          source={{
            uri: "https://res.cloudinary.com/dcdgu2fxc/image/upload/v1755495758/FlexLifeLogo-removebg-preview_n678qi.png",
          }}
        />
        <Text
          style={{
            fontSize: 24,
            color: "#ffffff",
            fontFamily: "Inter_700Bold",
            letterSpacing: -0.5,
            marginLeft: 4,
          }}
        >
          FlexLife
        </Text>
      </View>

      <View
        style={{
          marginLeft: "auto",
          flexDirection: "row",
          gap: 8,
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          activeOpacity={0.7}
          style={{
            width: 38,
            height: 38,
            borderRadius: 10,
            backgroundColor: "#191919",
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.04)",
          }}
        >
          <Fontisto name="bell" size={16} color="#888" />
        </TouchableOpacity>

        <Image
          style={{
            width: 38,
            height: 38,
            borderRadius: 10,
            borderWidth: 2,
            borderColor: "rgba(16, 185, 129, 0.25)",
          }}
          source={{
            uri: "https://res.cloudinary.com/dcdgu2fxc/image/upload/v1755494500/pfp_l6k1di.jpg",
          }}
        />
      </View>
    </Animated.View>
  );
}
