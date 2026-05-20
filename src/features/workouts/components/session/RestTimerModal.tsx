import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  Easing,
  FadeIn,
  FadeOut,
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";

const ACCENT = "#10b981";
const RADIUS = 110;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const STEP_SECONDS = 15;
const MIN_SECONDS = 15;
const MAX_SECONDS = 600;

type Props = {
  visible: boolean;
  onClose: () => void;
  durationSeconds?: number;
  onSaveAsDefault?: (seconds: number) => void;
};

export default function RestTimerModal({
  visible,
  onClose,
  durationSeconds = 180,
  onSaveAsDefault,
}: Props) {
  const [total, setTotal] = useState(durationSeconds);
  const [remaining, setRemaining] = useState(durationSeconds);
  const [savedFlash, setSavedFlash] = useState(false);
  const progress = useSharedValue(1);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!visible) return;

    setTotal(durationSeconds);
    setRemaining(durationSeconds);
    setSavedFlash(false);
    progress.value = 1;
    progress.value = withTiming(0, {
      duration: durationSeconds * 1000,
      easing: Easing.linear,
    });

    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [visible, durationSeconds]);

  const adjust = (delta: number) => {
    const nextTotal = Math.min(
      MAX_SECONDS,
      Math.max(MIN_SECONDS, total + delta)
    );
    const nextRemaining = Math.min(
      MAX_SECONDS,
      Math.max(0, remaining + delta)
    );
    setTotal(nextTotal);
    setRemaining(nextRemaining);
    progress.value = nextTotal > 0 ? nextRemaining / nextTotal : 0;
    progress.value = withTiming(0, {
      duration: nextRemaining * 1000,
      easing: Easing.linear,
    });
  };

  const handleSaveAsDefault = () => {
    if (!onSaveAsDefault) return;
    onSaveAsDefault(total);
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1200);
  };

  useEffect(() => {
    if (remaining === 0 && visible) {
      const t = setTimeout(onClose, 600);
      return () => clearTimeout(t);
    }
  }, [remaining, visible]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: CIRCUMFERENCE * (1 - progress.value),
  }));

  const handleSkip = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    progress.value = 0;
    setRemaining(0);
    onClose();
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const pct = total > 0 ? Math.round((remaining / total) * 100) : 0;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleSkip}
      statusBarTranslucent
    >
      <Animated.View
        entering={FadeIn.duration(250)}
        exiting={FadeOut.duration(200)}
        style={styles.overlay}
      >
        <View style={styles.content}>
          <Text style={styles.restLabel}>REST</Text>

          <View style={styles.ringContainer}>
            <Svg width={260} height={260} style={StyleSheet.absoluteFill}>
              {/* Track */}
              <Circle
                cx={130}
                cy={130}
                r={RADIUS}
                stroke="rgba(255,255,255,0.06)"
                strokeWidth={10}
                fill="none"
              />
              {/* Progress arc */}
              <AnimatedCircle
                cx={130}
                cy={130}
                r={RADIUS}
                stroke={ACCENT}
                strokeWidth={10}
                fill="none"
                strokeDasharray={CIRCUMFERENCE}
                animatedProps={animatedProps}
                strokeLinecap="round"
                rotation="-90"
                origin="130, 130"
              />
            </Svg>

            <View style={styles.timerCenter}>
              <Text style={styles.timerDigits}>{formatTime(remaining)}</Text>
              <Text style={styles.timerSub}>of {formatTime(total)} · {pct}%</Text>
            </View>
          </View>

          <View style={styles.hintRow}>
            <Ionicons name="barbell-outline" size={15} color="#444" />
            <Text style={styles.hintText}>Prepare for next set</Text>
          </View>

          <View style={styles.adjustRow}>
            <TouchableOpacity
              onPress={() => adjust(-STEP_SECONDS)}
              activeOpacity={0.8}
              style={styles.adjustButton}
            >
              <Ionicons name="remove" size={20} color={ACCENT} />
              <Text style={styles.adjustText}>15s</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => adjust(STEP_SECONDS)}
              activeOpacity={0.8}
              style={styles.adjustButton}
            >
              <Ionicons name="add" size={20} color={ACCENT} />
              <Text style={styles.adjustText}>15s</Text>
            </TouchableOpacity>
          </View>

          {onSaveAsDefault && (
            <TouchableOpacity
              onPress={handleSaveAsDefault}
              activeOpacity={0.8}
              style={styles.saveDefaultButton}
            >
              <Ionicons
                name={savedFlash ? "checkmark" : "bookmark-outline"}
                size={14}
                color="#666"
              />
              <Text style={styles.saveDefaultText}>
                {savedFlash ? "Saved as default" : "Save as default"}
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={handleSkip}
            activeOpacity={0.8}
            style={styles.skipButton}
          >
            <Text style={styles.skipText}>Skip Rest</Text>
            <Ionicons name="play-skip-forward" size={15} color={ACCENT} />
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.93)",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    alignItems: "center",
    gap: 32,
    paddingHorizontal: 32,
  },
  restLabel: {
    color: "#2a2a2a",
    fontSize: 11,
    fontFamily: "Inter_700Bold",
    letterSpacing: 7,
    textTransform: "uppercase",
  },
  ringContainer: {
    width: 260,
    height: 260,
    alignItems: "center",
    justifyContent: "center",
  },
  timerCenter: {
    alignItems: "center",
  },
  timerDigits: {
    color: "#fff",
    fontSize: 58,
    fontFamily: "Inter_700Bold",
    letterSpacing: -1,
    lineHeight: 68,
  },
  timerSub: {
    color: "#333",
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    letterSpacing: 0.5,
    marginTop: 4,
  },
  hintRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  hintText: {
    color: "#3a3a3a",
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    letterSpacing: 0.3,
  },
  skipButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: "rgba(16,185,129,0.2)",
    backgroundColor: "rgba(16,185,129,0.05)",
  },
  skipText: {
    color: ACCENT,
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.4,
  },
  adjustRow: {
    flexDirection: "row",
    gap: 14,
  },
  adjustButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    backgroundColor: "rgba(255,255,255,0.02)",
  },
  adjustText: {
    color: ACCENT,
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.3,
  },
  saveDefaultButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  saveDefaultText: {
    color: "#666",
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    letterSpacing: 0.3,
  },
});
