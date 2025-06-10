import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { PlatformPressable } from "@react-navigation/elements";
import { useLinkBuilder, useTheme } from "@react-navigation/native";
import { Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

import { IconSymbol } from "./ui/IconSymbol";

const AnimatedText = Animated.createAnimatedComponent(Text);

export function CustomTab({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const { colors } = useTheme();
  const { buildHref } = useLinkBuilder();

  const icon = {
    Home: ({ color, iconAnimatedStyle }: any) => (
      <Animated.View style={iconAnimatedStyle}>
        <IconSymbol size={32} name="house.fill" color={color} />
      </Animated.View>
    ),
    Workouts: ({ color, iconAnimatedStyle }: any) => (
      <Animated.View style={iconAnimatedStyle}>
        <IconSymbol size={32} name="dumbbell.fill" color={color} />
      </Animated.View>
    ),
    Overview: ({ color, iconAnimatedStyle }: any) => (
      <Animated.View style={iconAnimatedStyle}>
        <IconSymbol size={32} name="chart.bar.fill" color={color} />
      </Animated.View>
    ),
    Settings: ({ color, iconAnimatedStyle }: any) => (
      <Animated.View style={iconAnimatedStyle}>
        <IconSymbol size={32} name="gearshape.fill" color={color} />
      </Animated.View>
    ),
  };

  return (
    <View
      style={{
        backgroundColor: "#1E1E1E",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
        padding: 12,
        paddingHorizontal: 20,
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
                translateX: withTiming(isFocused ? 2 : 0, { duration: 200 }),
              },
            ],
          };
        }, [isFocused]);

        const iconAnimatedStyle = useAnimatedStyle(() => {
          return {
            transform: [
              {
                scale: withTiming(isFocused ? 0.8 : 1, { duration: 200 }),
              },
              {
                translateX: withTiming(isFocused ? 0 : 10, { duration: 200 }),
              },
            ],
          };
        }, [isFocused]);

        return (
          <PlatformPressable
            key={index}
            href={buildHref(route.name, route.params)}
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarButtonTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{
              backgroundColor: isFocused ? "#BFFA00" : "transparent",
              paddingHorizontal: 18,
              paddingRight: 24,
              paddingVertical: 8,
              borderRadius: 100,
            }}
          >
            <View className="flex-row items-center justify-center">
              {icon[route.name as keyof typeof icon]?.({
                color: isFocused ? "#000000" : colors.text,
                iconAnimatedStyle,
              })}
              {isFocused && (
                <AnimatedText
                  style={[
                    animatedStyle,
                    {
                      fontSize: 14,
                      marginRight: 4,
                    },
                  ]}
                >
                  {route.name}
                </AnimatedText>
              )}
            </View>
          </PlatformPressable>
        );
      })}
    </View>
  );
}
