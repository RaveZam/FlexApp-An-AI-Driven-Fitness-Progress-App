import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import React from "react";
import { Pressable, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import Ionicons from "@expo/vector-icons/Ionicons";
import { IconSymbol } from "./ui/IconSymbol";

const ACTIVE_COLOR = "#4ade80";
const INACTIVE_COLOR = "#4B5563";

const TAB_TITLES: Record<string, string> = {
  index: "Home",
  Workouts: "Workouts",
  Overview: "Progress",
  Settings: "Settings",
};

type TabItemProps = {
  routeName: string;
  isFocused: boolean;
  options: any;
  onPress: () => void;
  onLongPress: () => void;
};

function TabItem({ routeName, isFocused, options, onPress, onLongPress }: TabItemProps) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const color = isFocused ? ACTIVE_COLOR : INACTIVE_COLOR;

  const iconMap: Record<string, React.ReactElement> = {
    index: <IconSymbol size={32} name="house.fill" color={color} />,
    Workouts: <Ionicons name="barbell" size={32} color={color} />,
    Overview: <IconSymbol size={32} name="chart.bar.fill" color={color} />,
    Settings: <IconSymbol size={32} name="gearshape.fill" color={color} />,
  };

  return (
    <Pressable
      accessibilityState={isFocused ? { selected: true } : {}}
      accessibilityLabel={options.tabBarAccessibilityLabel}
      testID={options.tabBarButtonTestID}
      onPress={onPress}
      onLongPress={onLongPress}
      onPressIn={() => { scale.value = withTiming(0.85, { duration: 100 }); }}
      onPressOut={() => { scale.value = withTiming(1, { duration: 150 }); }}
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
      <Animated.View style={[{ alignItems: "center", justifyContent: "center" }, animatedStyle]}>
        {iconMap[routeName]}
        <Text
          style={{
            fontSize: 11,
            marginTop: routeName === "Settings" ? 8 : 6,
            color,
            fontWeight: isFocused ? "600" : "400",
            textAlign: "center",
          }}
        >
          {TAB_TITLES[routeName] ?? routeName}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

export function CustomTab({ state, descriptors, navigation }: BottomTabBarProps) {
  return (
    <View
      style={{
        backgroundColor: "#0f0f0f",
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
        paddingVertical: 4,
        borderTopWidth: 1,
        borderTopColor: "rgba(26, 71, 42, 0.2)",
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
          navigation.emit({ type: "tabLongPress", target: route.key });
        };

        return (
          <TabItem
            key={route.key}
            routeName={route.name}
            isFocused={isFocused}
            options={options}
            onPress={onPress}
            onLongPress={onLongPress}
          />
        );
      })}
    </View>
  );
}
