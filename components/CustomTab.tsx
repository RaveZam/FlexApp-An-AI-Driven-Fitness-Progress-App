import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useTheme } from "@react-navigation/native";
import { Text, TouchableOpacity, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

import Ionicons from "@expo/vector-icons/Ionicons";
import { IconSymbol } from "./ui/IconSymbol";

const AnimatedText = Animated.createAnimatedComponent(Text);

export function CustomTab({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const { colors } = useTheme();

  const icon = {
    index: ({ color, iconAnimatedStyle }: any) => (
      <Animated.View style={iconAnimatedStyle}>
        <IconSymbol size={24} name="house.fill" color={color} />
      </Animated.View>
    ),
    Workouts: ({ color, iconAnimatedStyle }: any) => (
      <Animated.View style={iconAnimatedStyle}>
        <Ionicons name="barbell" size={24} color={color} />
      </Animated.View>
    ),
    Overview: ({ color, iconAnimatedStyle }: any) => (
      <Animated.View style={iconAnimatedStyle}>
        <IconSymbol size={24} name="chart.bar.fill" color={color} />
      </Animated.View>
    ),
    Settings: ({ color, iconAnimatedStyle }: any) => (
      <Animated.View style={iconAnimatedStyle}>
        <IconSymbol size={22} name="gearshape.fill" color={color} />
      </Animated.View>
    ),
  };

  const getTabTitle = (routeName: string) => {
    switch (routeName) {
      case "index":
        return "Home";
      case "Workouts":
        return "Workouts";
      case "Overview":
        return "Progress";
      case "Settings":
        return "Settings";
      default:
        return routeName;
    }
  };

  return (
    <View
      style={{
        backgroundColor: "#FFFFFF",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
        paddingVertical: 4,
        borderTopWidth: 1,
        borderTopColor: "#E5E7EB",
      }}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        const animatedStyle = useAnimatedStyle(() => {
          return {
            opacity: withTiming(isFocused ? 1 : 0, { duration: 200 }),
            transform: [
              {
                translateX: withTiming(isFocused ? 2 : 0, { duration: 300 }),
              },
            ],
          };
        }, [isFocused]);

        const iconAnimatedStyle = useAnimatedStyle(() => {
          return {
            transform: [
              {
                scale: withTiming(isFocused ? 1 : 1, { duration: 300 }),
              },
            ],
          };
        }, [isFocused]);

        return (
          <TouchableOpacity
            key={index}
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarButtonTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{
              backgroundColor: "transparent",
              paddingVertical: 12,
              paddingHorizontal: 16,
              borderRadius: 8,
              alignItems: "center",
              justifyContent: "center",
              minWidth: 70,
              flex: 1,
            }}
          >
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              {icon[route.name as keyof typeof icon]?.({
                color: isFocused ? "#374151" : "#9CA3AF",
                iconAnimatedStyle,
              })}
              <Text
                style={{
                  fontSize: 11,
                  marginTop: route.name === "Settings" ? 8 : 6,
                  color: isFocused ? "#374151" : "#9CA3AF",
                  fontWeight: isFocused ? "600" : "400",
                  textAlign: "center",
                }}
              >
                {getTabTitle(route.name)}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
