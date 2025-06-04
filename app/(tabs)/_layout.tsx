import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { CustomTab } from "@/components/CustomTab";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      tabBar={(props) => <CustomTab {...props} />}
      screenOptions={{
        // tabBarActiveTintColor: "#ffffff",
        headerShown: false,
        // tabBarButton: CustomTab,
        // tabBarBackground: ,

        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: "absolute",
          },

          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="Home"
        options={{
          title: "Home",
        }}
      />
      <Tabs.Screen
        name="Workouts"
        options={{
          title: "Workouts",
        }}
      />
      <Tabs.Screen
        name="Overview"
        options={{
          title: "Overview",
        }}
      />
      <Tabs.Screen
        name="Settings"
        options={{
          title: "Settings",
        }}
      />
    </Tabs>
  );
}
