import { useThemeColor } from "@/hooks/useThemeColor";
import { View, type ViewProps } from "react-native";

export type ColorToken =
  | "background"
  | "secondaryBackground"
  | "border"
  | "text"
  | "primary";

export type ThemedViewProps = ViewProps & {
  colorToken?: ColorToken; // optional token
  borderToken?: ColorToken; // optional border color token
  borderWidth?: number; // optional border width
};

export function ThemedView({
  style,
  colorToken = "background",
  borderToken,
  borderWidth = 1,
  ...otherProps
}: ThemedViewProps) {
  const backgroundColor = useThemeColor({}, colorToken);
  const borderColorFromToken = useThemeColor({}, borderToken ?? colorToken);
  const borderColor = borderToken ? borderColorFromToken : undefined;

  return (
    <View
      style={[
        { backgroundColor },
        borderColor ? { borderColor, borderWidth } : {},
        style,
      ]}
      {...otherProps}
    />
  );
}
