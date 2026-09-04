import { FontFamilies } from "@/constants/theme";
import { usePalette, type Palette } from "@/src/theme";
import { useMemo } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { formatStamp, formatVolume } from "../sessionStats";
import type { WorkoutSessionSummary } from "../types";

type Props = {
  session: WorkoutSessionSummary | null;
  onClose: () => void;
  onDelete: (id: string) => void;
};

export default function SessionActionSheet({ session, onClose, onDelete }: Props) {
  const p = usePalette();
  const styles = useMemo(() => makeStyles(p), [p]);

  return (
    <Modal visible={!!session} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.scrim} onPress={onClose}>
        <Animated.View entering={FadeInDown.duration(220)}>
          <Pressable style={styles.sheet}>
            <Text style={styles.stamp}>
              {session ? formatStamp(session.completedAt) : ""}
            </Text>
            <Text style={styles.name} numberOfLines={2}>
              {session?.name}
            </Text>
            <Text style={styles.meta}>
              {session?.completedSetCount} sets · {formatVolume(session?.volume ?? 0)} lb
            </Text>

            <View style={styles.rule} />

            <Text style={styles.warning}>
              Deleting removes this entry from the ledger for good.
            </Text>

            <Pressable
              onPress={() => {
                if (session) onDelete(session.id);
                onClose();
              }}
              accessibilityRole="button"
              style={styles.delete}
            >
              <Text style={styles.deleteLabel}>Delete entry</Text>
            </Pressable>
            <Pressable onPress={onClose} accessibilityRole="button" style={styles.cancel}>
              <Text style={styles.cancelLabel}>Keep it</Text>
            </Pressable>
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

const makeStyles = (p: Palette) =>
  StyleSheet.create({
    scrim: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.65)",
      justifyContent: "flex-end",
      padding: 16,
    },
    sheet: {
      backgroundColor: p.ink,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: p.hairlineStrong,
      borderRadius: 4,
      paddingHorizontal: 22,
      paddingTop: 24,
      paddingBottom: 18,
    },
    stamp: {
      fontFamily: FontFamilies.medium,
      fontSize: 9,
      color: p.muted,
      letterSpacing: 1.8,
      textTransform: "uppercase",
      marginBottom: 8,
    },
    name: {
      fontFamily: FontFamilies.displayExtraLight,
      fontSize: 28,
      color: p.bone,
      letterSpacing: -0.7,
      lineHeight: 32,
    },
    meta: {
      fontFamily: FontFamilies.regular,
      fontSize: 12,
      color: p.muted,
      marginTop: 6,
    },
    rule: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: p.hairline,
      marginVertical: 20,
    },
    warning: {
      fontFamily: FontFamilies.regular,
      fontSize: 13,
      color: p.muted,
      marginBottom: 18,
    },
    delete: {
      alignItems: "center",
      paddingVertical: 16,
      borderRadius: 4,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: p.dangerBorder,
      backgroundColor: p.dangerSoft,
    },
    deleteLabel: {
      fontFamily: FontFamilies.displayRegular,
      fontSize: 11,
      color: p.danger,
      letterSpacing: 3,
      textTransform: "uppercase",
    },
    cancel: {
      alignItems: "center",
      paddingVertical: 16,
    },
    cancelLabel: {
      fontFamily: FontFamilies.displayRegular,
      fontSize: 11,
      color: p.muted,
      letterSpacing: 3,
      textTransform: "uppercase",
    },
  });
