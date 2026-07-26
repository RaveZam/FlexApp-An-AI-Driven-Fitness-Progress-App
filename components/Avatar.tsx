import { FontFamilies } from "@/constants/theme";
import { usePalette, type Palette } from "@/src/theme";
import { useEffect, useMemo, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";

type AvatarProps = {
  uri?: string | null;
  name?: string | null;
  email?: string | null;
  size?: number;
};

function initialFrom(name?: string | null, email?: string | null) {
  const source = name?.trim() || email?.trim() || "";
  return source.charAt(0).toUpperCase() || "?";
}

export default function Avatar({ uri, name, email, size = 36 }: AvatarProps) {
  const p = usePalette();
  const styles = useMemo(() => makeStyles(p), [p]);
  const [failed, setFailed] = useState(false);

  // Reset when the source changes so a new avatar gets a fresh load attempt.
  useEffect(() => {
    setFailed(false);
  }, [uri]);

  const dimensions = {
    width: size,
    height: size,
    borderRadius: size / 2,
  };

  if (uri && !failed) {
    return (
      <Image
        style={[styles.avatar, dimensions]}
        source={{ uri }}
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <View style={[styles.avatar, styles.initials, dimensions]}>
      <Text style={[styles.initialsText, { fontSize: size * 0.42 }]}>
        {initialFrom(name, email)}
      </Text>
    </View>
  );
}

const makeStyles = (p: Palette) =>
  StyleSheet.create({
    avatar: {
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: p.accentBorder,
    },
    initials: {
      backgroundColor: p.accentSoft,
      alignItems: "center",
      justifyContent: "center",
    },
    initialsText: {
      color: p.accent,
      fontFamily: FontFamilies.displayMedium,
    },
  });
