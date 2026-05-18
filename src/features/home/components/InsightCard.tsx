import { FontFamilies, Palette } from "@/constants/theme";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface InsightCardProps {
  icon: React.ReactNode;
  mainText: string;
  subText: string;
}

export function InsightCard({ icon, mainText, subText }: InsightCardProps) {
  return (
    <View style={styles.card}>
      <LinearGradient
        colors={["rgba(52,211,153,0.06)", "rgba(52,211,153,0)"]}
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

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 16,
    borderRadius: 16,
    backgroundColor: Palette.inkRaised,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Palette.hairlineStrong,
    overflow: "hidden",
  },
  medallion: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Palette.accentBorder,
    alignItems: "center",
    justifyContent: "center",
    padding: 4,
  },
  medallionInner: {
    flex: 1,
    width: "100%",
    borderRadius: 20,
    backgroundColor: "rgba(52,211,153,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  main: {
    color: Palette.bone,
    fontSize: 13,
    fontFamily: FontFamilies.displayMedium,
    letterSpacing: -0.2,
    lineHeight: 18,
  },
  sub: {
    color: Palette.muted,
    fontSize: 11,
    fontFamily: FontFamilies.regular,
    marginTop: 4,
    letterSpacing: 0.3,
    lineHeight: 15,
  },
});
