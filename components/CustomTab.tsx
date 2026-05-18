import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import { FontFamilies, Palette } from "@/constants/theme";
import { IconSymbol } from "./ui/IconSymbol";

const TAB_TITLES: Record<string, string> = {
  index: "Home",
  Workouts: "Train",
  History: "History",
  Overview: "Progress",
  Settings: "Profile",
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

  const color = isFocused ? Palette.accent : Palette.muted;

  const iconMap: Record<string, React.ReactElement> = {
    index: <IconSymbol size={22} name="house.fill" color={color} />,
    Workouts: <Ionicons name="barbell" size={22} color={color} />,
    History: <Ionicons name="time-outline" size={22} color={color} />,
    Overview: <IconSymbol size={22} name="chart.bar.fill" color={color} />,
    Settings: <IconSymbol size={22} name="gearshape.fill" color={color} />,
  };

  return (
    <Pressable
      accessibilityState={isFocused ? { selected: true } : {}}
      accessibilityLabel={options.tabBarAccessibilityLabel}
      testID={options.tabBarButtonTestID}
      onPress={onPress}
      onLongPress={onLongPress}
      onPressIn={() => {
        scale.value = withTiming(0.92, { duration: 100 });
      }}
      onPressOut={() => {
        scale.value = withTiming(1, { duration: 150 });
      }}
      style={styles.tabPressable}
    >
      <Animated.View style={[styles.tabInner, animatedStyle]}>
        {iconMap[routeName]}
        <Text
          style={[
            styles.label,
            {
              color: isFocused ? Palette.bone : Palette.muted,
              fontFamily: isFocused ? FontFamilies.medium : FontFamilies.regular,
            },
          ]}
        >
          {TAB_TITLES[routeName] ?? routeName}
        </Text>
        <View
          style={[
            styles.indicator,
            { backgroundColor: isFocused ? Palette.accent : "transparent" },
          ]}
        />
      </Animated.View>
    </Pressable>
  );
}

export function CustomTab({ state, descriptors, navigation }: BottomTabBarProps) {
  return (
    <SafeAreaView edges={["bottom"]} style={styles.safe}>
      <View style={styles.hairline} />
      <View style={styles.bar}>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    backgroundColor: Palette.ink,
  },
  hairline: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Palette.hairlineStrong,
  },
  bar: {
    flexDirection: "row",
    alignItems: "stretch",
    justifyContent: "space-between",
    paddingTop: 10,
    paddingBottom: 6,
    paddingHorizontal: 8,
    backgroundColor: Palette.ink,
  },
  tabPressable: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  tabInner: {
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  label: {
    fontSize: 9,
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  indicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 2,
  },
});
