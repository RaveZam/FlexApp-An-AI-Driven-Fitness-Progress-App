/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = "#0a7ea4";
const tintColorDark = "#fff";

export const Colors = {
  light: {
    primary: "#1F2937",
    secondary: "#D1D5DB",
    tertiary: "#4B5563",
    text: "#111827",
    mutedText: "#828894",
    background: "#FFFFFF",
    secondaryBackground: "#F9FAFB",
    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
    border: "#E5E7EB",
  },
  dark: {
    primary: "#1F2937",
    secondary: "#D1D5DB",
    text: "#ECEDEE",
    mutedText: "#757C88",
    background: "#151718",
    secondaryBackground: "#1F2937",
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
    border: "#262626",
  },
};
