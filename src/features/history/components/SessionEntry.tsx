import { FontFamilies } from "@/constants/theme";
import { loadLadder, usePalette, type Palette } from "@/src/theme";
import { Ionicons } from "@expo/vector-icons";
import { useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import {
  formatDuration,
  formatStamp,
  formatVolume,
  loadRung,
} from "../sessionStats";
import type { WorkoutSessionSummary } from "../types";
import { SPINE_GUTTER, SPINE_X } from "./spine";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// The node grows with its rung, so a heavy day is bigger and brighter at once.
const NODE_SIZE = [7, 8, 9, 11, 13];

type Props = {
  session: WorkoutSessionSummary;
  peak: number;
  onOpen: (id: string) => void;
  onMenu: (session: WorkoutSessionSummary) => void;
};

export default function SessionEntry({ session, peak, onOpen, onMenu }: Props) {
  const p = usePalette();
  const styles = useMemo(() => makeStyles(p), [p]);
  const reduceMotion = useReducedMotion();

  const dim = useSharedValue(1);
  const fade = useAnimatedStyle(() => ({ opacity: dim.value }));
  const press = (to: number) => {
    dim.value = reduceMotion ? to : withTiming(to, { duration: 140 });
  };

  const rung = loadRung(session.volume, peak);
  const size = NODE_SIZE[rung];
  const isOpen = session.status === "in_progress";
  const isCancelled = session.status === "cancelled";
  const nodeColor = isCancelled ? p.danger : isOpen ? p.accent : loadLadder(p)[rung];

  return (
    <AnimatedPressable
      onPress={() => onOpen(session.id)}
      onLongPress={() => onMenu(session)}
      onPressIn={() => press(0.6)}
      onPressOut={() => press(1)}
      accessibilityRole="button"
      accessibilityLabel={`${session.name}, ${formatStamp(session.completedAt)}`}
      style={[styles.row, fade]}
    >
      <View style={styles.gutter}>
        <View style={styles.rule} />
        <View
          style={[
            styles.node,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              left: SPINE_X - size / 2 + StyleSheet.hairlineWidth / 2,
              borderColor: nodeColor,
              backgroundColor: isOpen || isCancelled ? p.ink : nodeColor,
            },
          ]}
        />
      </View>

      <View style={styles.body}>
        <View style={styles.headline}>
          <Text style={styles.stamp}>
            {formatStamp(session.completedAt)}
            {isOpen && <Text style={{ color: p.accent }}> · Open</Text>}
            {isCancelled && <Text style={{ color: p.danger }}> · Cancelled</Text>}
          </Text>
          <Text style={[styles.volume, { color: session.volume > 0 ? nodeColor : p.mutedSoft }]}>
            {formatVolume(session.volume)}
            <Text style={styles.volumeUnit}>{session.volume > 0 ? " lb" : ""}</Text>
          </Text>
        </View>

        <Text style={styles.name} numberOfLines={1}>
          {session.name}
        </Text>

        <View style={styles.metaRow}>
          <Text style={styles.meta} numberOfLines={1}>
            {session.exerciseCount} exercises · {session.completedSetCount} sets ·{" "}
            {formatDuration(session.startedAt, session.completedAt)}
          </Text>
          <Pressable
            onPress={() => onMenu(session)}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel={`Actions for ${session.name}`}
            style={styles.menuBtn}
          >
            <Ionicons name="ellipsis-horizontal" size={15} color={p.mutedSoft} />
          </Pressable>
        </View>
      </View>
    </AnimatedPressable>
  );
}

const makeStyles = (p: Palette) =>
  StyleSheet.create({
    row: {
      flexDirection: "row",
      paddingBottom: 22,
    },
    gutter: {
      width: SPINE_GUTTER,
    },
    rule: {
      position: "absolute",
      left: SPINE_X,
      top: 0,
      bottom: -1,
      width: StyleSheet.hairlineWidth,
      backgroundColor: p.hairlineStrong,
    },
    node: {
      position: "absolute",
      top: 3,
      borderWidth: StyleSheet.hairlineWidth,
    },
    body: {
      flex: 1,
      gap: 5,
    },
    headline: {
      flexDirection: "row",
      alignItems: "baseline",
      justifyContent: "space-between",
      gap: 12,
    },
    stamp: {
      fontFamily: FontFamilies.medium,
      fontSize: 9,
      color: p.muted,
      letterSpacing: 1.8,
      textTransform: "uppercase",
    },
    volume: {
      fontFamily: FontFamilies.displayMedium,
      fontSize: 19,
      letterSpacing: -0.4,
      fontVariant: ["tabular-nums"],
    },
    volumeUnit: {
      fontFamily: FontFamilies.medium,
      fontSize: 10,
      letterSpacing: 1,
    },
    name: {
      fontFamily: FontFamilies.semibold,
      fontSize: 15,
      color: p.bone,
      letterSpacing: -0.1,
    },
    metaRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    meta: {
      flex: 1,
      fontFamily: FontFamilies.regular,
      fontSize: 12,
      color: p.muted,
    },
    menuBtn: {
      paddingLeft: 6,
    },
  });
