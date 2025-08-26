import { FontFamilies, FontSizes } from "@/constants";
import { Colors } from "@/constants/Colors";
import { useThemeColor } from "@/hooks/useThemeColor";
import { StyleSheet, Text, type TextProps } from "react-native";

export type ColorToken = "text" | "mutedText" | "tint" | "icon";

export type ThemedTextProps = TextProps & {
  colorToken?: ColorToken;
  type?:
    | "default"
    | "title"
    | "defaultSemiBold"
    | "subtitle"
    | "link"
    | "muted"
    | "primary"
    | "cardTitle";
};

export function ThemedText({
  style,
  colorToken,
  type = "default",
  ...rest
}: ThemedTextProps) {
  let token: ColorToken =
    colorToken ?? (type === "muted" ? "mutedText" : "text");

  const color = useThemeColor({}, token);

  return (
    <Text
      style={[
        { color },
        type === "default" ? styles.default : undefined,
        type === "title" ? styles.title : undefined,
        type === "defaultSemiBold" ? styles.defaultSemiBold : undefined,
        type === "subtitle" ? styles.subtitle : undefined,
        type === "link" ? styles.link : undefined,
        type === "muted" ? styles.muted : undefined,
        type === "cardTitle" ? styles.cardTitle : undefined,

        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: FontSizes.body,
    lineHeight: 24,
    fontFamily: FontFamilies.regular,
  },
  defaultSemiBold: {
    fontSize: FontSizes.body,
    lineHeight: 24,
    fontFamily: FontFamilies.medium,
  },
  title: {
    fontSize: FontSizes.title,
    lineHeight: 32,
  },
  subtitle: {
    fontSize: FontSizes.subtitle,
  },
  link: {
    fontSize: FontSizes.body,
    lineHeight: 30,
    fontFamily: FontFamilies.regular,
  },
  muted: {
    fontSize: FontSizes.body,
    lineHeight: 24,
    fontFamily: FontFamilies.regular,
    color: Colors.light.mutedText,
  },
  cardTitle: {
    fontSize: FontSizes.small,
    lineHeight: 24,
    fontFamily: FontFamilies.regular,
  },
});
