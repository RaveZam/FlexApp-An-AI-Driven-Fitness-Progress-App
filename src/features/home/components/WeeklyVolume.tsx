import { Feather } from "@expo/vector-icons";
import { Dimensions, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import * as Progress from "react-native-progress";

export function WeeklyVolume() {
  return (
    <Animated.View
      entering={FadeInDown.delay(330).duration(400)}
      style={{
        marginHorizontal: 16,
        borderRadius: 16,
        backgroundColor: "#191919",
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.04)",
      }}
    >
      {/* Accent strip */}
      <View
        style={{
          height: 3,
          backgroundColor: "#3b82f6",
          opacity: 0.6,
        }}
      />

      <View style={{ padding: 16 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 12,
          }}
        >
          <Text
            style={{
              color: "#ffffff",
              fontSize: 15,
              fontFamily: "Inter_600SemiBold",
            }}
          >
            Weekly Volume
          </Text>
          <View
            style={{
              backgroundColor: "#1e3a5f",
              paddingHorizontal: 8,
              paddingVertical: 3,
              borderRadius: 6,
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
            }}
          >
            <Feather name="trending-up" size={11} color="#3b82f6" />
            <Text
              style={{
                color: "#3b82f6",
                fontSize: 11,
                fontFamily: "Inter_700Bold",
              }}
            >
              +12%
            </Text>
          </View>
        </View>

        {/* Progress bar */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
            marginBottom: 8,
          }}
        >
          <View style={{ flex: 1 }}>
            <Progress.Bar
              progress={0.66}
              width={null}
              height={8}
              color="#3b82f6"
              unfilledColor="rgba(59, 130, 246, 0.1)"
              borderColor="transparent"
              borderRadius={4}
              animationConfig={{
                bounciness: 1,
              }}
            />
          </View>
          <Text
            style={{
              color: "#3b82f6",
              fontSize: 14,
              fontFamily: "Inter_700Bold",
              minWidth: 38,
              textAlign: "right",
            }}
          >
            66%
          </Text>
        </View>

        <Text
          style={{
            color: "#555",
            fontSize: 12,
            fontFamily: "Inter_400Regular",
          }}
        >
          47,250 lbs of 60,000 lbs goal
        </Text>
      </View>
    </Animated.View>
  );
}
