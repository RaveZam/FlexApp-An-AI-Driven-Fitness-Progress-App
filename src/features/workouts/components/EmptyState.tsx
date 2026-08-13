import { FontFamilies } from "@/constants/theme";
import { usePalette, type Palette } from "@/src/theme";
import { Ionicons } from "@expo/vector-icons";
import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = { title: string; body?: string };

export function EmptyState({ title, body }: Props) {
  const p = usePalette();
  const styles = useMemo(() => makeStyles(p), [p]);

  return (
    <>
      <View style={styles.glyph}>
        <Ionicons name="barbell-outline" size={26} color={p.muted} />
      </View>
      <Text style={styles.title}>{title}</Text>
      {body && <Text style={styles.body}>{body}</Text>}
    </>
  );
}

const makeStyles = (p: Palette) =>
  StyleSheet.create({
    glyph: {
      width: 64,
      height: 64,
      borderRadius: 32,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: p.hairlineStrong,
      backgroundColor: p.inkRaised,
      marginBottom: 18,
    },
    title: {
      color: p.bone,
      fontSize: 18,
      fontFamily: FontFamilies.displayMedium,
      letterSpacing: -0.3,
      marginBottom: 7,
    },
    body: {
      color: p.muted,
      fontSize: 13,
      fontFamily: FontFamilies.regular,
      textAlign: "center",
      lineHeight: 19,
    },
  });
