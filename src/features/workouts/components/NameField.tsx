import { usePalette, type Palette } from "@/src/theme";
import { useMemo } from "react";
import { StyleSheet, Text, TextInput } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

type Props = {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (value: string) => void;
  autoFocus?: boolean;
  onSubmitEditing?: () => void;
};

export function NameField({
  label,
  placeholder,
  value,
  onChangeText,
  autoFocus,
  onSubmitEditing,
}: Props) {
  const p = usePalette();
  const styles = useMemo(() => makeStyles(p), [p]);

  return (
    <Animated.View entering={FadeInDown.delay(100).duration(350)}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={p.mutedSoft}
        autoFocus={autoFocus}
        returnKeyType={onSubmitEditing ? "done" : undefined}
        onSubmitEditing={onSubmitEditing}
        style={styles.input}
      />
    </Animated.View>
  );
}

const makeStyles = (p: Palette) =>
  StyleSheet.create({
    label: {
      color: p.muted,
      fontSize: 11,
      fontFamily: "Inter_500Medium",
      letterSpacing: 0.8,
      textTransform: "uppercase",
      marginBottom: 8,
    },
    input: {
      backgroundColor: p.inkRaised,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: p.hairline,
      color: p.bone,
      fontFamily: "Inter_500Medium",
      fontSize: 16,
      padding: 14,
    },
  });
