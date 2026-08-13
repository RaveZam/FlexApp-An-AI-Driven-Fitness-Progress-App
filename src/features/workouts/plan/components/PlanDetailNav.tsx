import { usePalette, type Palette } from "@/src/theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import { Pressable, StyleSheet, View } from "react-native";

type Props = { planId: string | undefined; canAddWorkout: boolean };

export function PlanDetailNav({ planId, canAddWorkout }: Props) {
  const p = usePalette();
  const styles = useMemo(() => makeStyles(p), [p]);
  const router = useRouter();

  return (
    <View style={styles.navRow}>
      <Pressable onPress={() => router.back()} style={styles.iconButton}>
        <Ionicons name="chevron-back" size={20} color={p.bone} />
      </Pressable>

      {canAddWorkout && (
        <Pressable
          onPress={() =>
            router.push({
              pathname: "/(tabs)/Workouts/create",
              params: { planId: planId ?? "" },
            })
          }
          style={styles.iconButton}
        >
          <Ionicons name="add" size={22} color={p.accent} />
        </Pressable>
      )}
    </View>
  );
}

const makeStyles = (p: Palette) =>
  StyleSheet.create({
    navRow: {
      paddingHorizontal: 20,
      paddingTop: 8,
      paddingBottom: 6,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    iconButton: {
      width: 38,
      height: 38,
      borderRadius: 12,
      backgroundColor: p.inkRaised,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: p.hairlineStrong,
    },
  });
