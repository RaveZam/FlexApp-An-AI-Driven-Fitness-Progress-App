import { FontFamilies } from "@/constants/theme";
import { usePalette, type Palette } from "@/src/theme";
import { LinearGradient } from "expo-linear-gradient";
import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";

interface InsightCardProps {
  icon: React.ReactNode;
  mainText: string;
  subText: string;
}

export function InsightCard({ icon, mainText, subText }: InsightCardProps) {
  const p = usePalette();
  const styles = useMemo(() => makeStyles(p), [p]);
  return (
    <View style={styles.card}>
      <LinearGradient
        colors={[p.accentSoft, "transparent"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />
      <View style={styles.medallion}>
        <View style={styles.medallionInner}>{icon}</View>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.main}>{mainText}</Text>
        <Text style={styles.sub}>{subText}</Text>
      </View>
    </View>
  );
}

const makeStyles = (p: Palette) =>
  StyleSheet.create({
    card: {
      flexDirection: "row",
      alignItems: "center",
      gap: 14,
      padding: 16,
      borderRadius: 16,
      backgroundColor: p.inkRaised,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: p.hairlineStrong,
      overflow: "hidden",
    },
    medallion: {
      width: 44,
      height: 44,
      borderRadius: 22,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: p.accentBorder,
      alignItems: "center",
      justifyContent: "center",
      padding: 4,
    },
    medallionInner: {
      flex: 1,
      width: "100%",
      borderRadius: 20,
      backgroundColor: p.accentSoft,
      alignItems: "center",
      justifyContent: "center",
    },
    main: {
      color: p.bone,
      fontSize: 13,
      fontFamily: FontFamilies.displayMedium,
      letterSpacing: -0.2,
      lineHeight: 18,
    },
    sub: {
      color: p.muted,
      fontSize: 11,
      fontFamily: FontFamilies.regular,
      marginTop: 4,
      letterSpacing: 0.3,
      lineHeight: 15,
    },
  });
