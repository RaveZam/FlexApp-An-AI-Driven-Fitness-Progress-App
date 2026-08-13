import { usePalette, type Palette } from "@/src/theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

type Props = {
  title: string;
  actionLabel: string;
  saving: boolean;
  onSave: () => void;
};

export function CreateHeader({ title, actionLabel, saving, onSave }: Props) {
  const p = usePalette();
  const styles = useMemo(() => makeStyles(p), [p]);
  const router = useRouter();

  return (
    <Animated.View
      entering={FadeInDown.delay(50).duration(350)}
      style={styles.header}
    >
      <View style={styles.side}>
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.7}
          hitSlop={8}
        >
          <Ionicons name="chevron-back" size={24} color={p.muted} />
        </TouchableOpacity>
      </View>

      <View style={styles.center}>
        <Text style={styles.title}>{title}</Text>
      </View>

      <View style={styles.right}>
        <TouchableOpacity
          onPress={onSave}
          disabled={saving}
          activeOpacity={0.7}
          style={styles.saveButton}
        >
          <Text style={[styles.saveText, saving && styles.saveTextDisabled]}>
            {saving ? "Saving…" : actionLabel}
          </Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const makeStyles = (p: Palette) =>
  StyleSheet.create({
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingTop: 8,
      paddingBottom: 16,
    },
    side: { flex: 1 },
    center: { flex: 1, alignItems: "center" },
    right: { flex: 1, alignItems: "flex-end" },
    title: {
      color: p.bone,
      fontSize: 18,
      fontFamily: "Inter_600SemiBold",
      letterSpacing: -0.3,
    },
    saveButton: {
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 10,
      backgroundColor: p.accentSoft,
      borderWidth: 1,
      borderColor: p.accentBorderSoft,
    },
    saveText: {
      color: p.accent,
      fontSize: 13,
      fontFamily: "Inter_600SemiBold",
    },
    saveTextDisabled: { color: p.mutedSoft },
  });
