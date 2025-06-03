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
        <IconSymbol size={28} name="house.fill" color={color} />
      </Animated.View>
    ),
    Workouts: ({ color, iconAnimatedStyle }: any) => (
      <Animated.View style={iconAnimatedStyle}>
        <IconSymbol size={28} name="dumbbell.fill" color={color} />
      </Animated.View>
    ),
    Performance: ({ color, iconAnimatedStyle }: any) => (
      <Animated.View style={iconAnimatedStyle}>
        <IconSymbol size={28} name="chart.bar.fill" color={color} />
      </Animated.View>
    ),
    Settings: ({ color, iconAnimatedStyle }: any) => (
      <Animated.View style={iconAnimatedStyle}>
        <IconSymbol size={28} name="gearshape.fill" color={color} />
      </Animated.View>
    ),
  };

  return (
    <View className="flex-row  justify-between p-4">
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
            opacity: withTiming(isFocused ? 1 : 0, { duration: 300 }),
            transform: [
              {
                translateX: withTiming(isFocused ? 10 : 0, { duration: 300 }),
              },
            ],
          };
        }, [isFocused]);

        const iconAnimatedStyle = useAnimatedStyle(() => {
          return {
            transform: [
              {
                translateX: withTiming(isFocused ? 0 : 10, { duration: 300 }),
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
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",

              flex: 1,
            }}
          >
            {icon[route.name as keyof typeof icon]?.({
              color: isFocused ? colors.primary : colors.text,
              iconAnimatedStyle,
            })}

            <AnimatedText
              style={[
                animatedStyle,
                { color: isFocused ? colors.primary : colors.text },
                { fontSize: 12, position: "absolute" },
              ]}
            >
              {route.name === state.routes[state.index].name ? route.name : ""}
            </AnimatedText>
          </PlatformPressable>
        );
      })}
    </View>
  );
}
