import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import { AppState, Modal, Platform, StyleSheet, Text, TouchableOpacity, Vibration, View } from "react-native";
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

// ~3 buzzes when rest ends. iOS buzzes are fixed-length and the numbers are the
// gaps between them; Android numbers are [wait, vibrate, ...].
const REST_DONE_PATTERN =
  Platform.OS === "ios"
    ? [0, 500, 500, 500, 500, 500]
    : [0, 500, 150, 500, 150, 500, 150, 500, 150, 500];

type Props = {
  visible: boolean;
  onClose: () => void;
  restSeconds?: number;
};

export default function RestTimerModal({ visible, onClose, restSeconds = 90 }: Props) {
  const [remaining, setRemaining] = useState(0);
  const progress = useSharedValue(1);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const restTime = restSeconds;
  // Absolute end time so the countdown stays accurate across backgrounding,
  // where JS timers are suspended and would otherwise drift.

  const endsAtRef = useRef(0);

  useEffect(() => {
    if (!visible) return;
    endsAtRef.current = Date.now() + restTime * 1000;

    const appStateSub = AppState.addEventListener("change", (state) => {
      if (state === "active") sync();
    });

    // Recompute remaining from the end time and re-animate the ring for
    // whatever time is left. Called on start and whenever the app returns
    // to the foreground (the interval below doesn't tick while suspended).
    const sync = () => {
      const remainingMs = Math.max(0, endsAtRef.current - Date.now());
      setRemaining(Math.ceil(remainingMs / 1000));
      progress.value = restTime > 0 ? remainingMs / (restTime * 1000) : 0;
      progress.value = withTiming(0, {
        duration: remainingMs,
        easing: Easing.linear,
      });
    };

    sync();

    intervalRef.current = setInterval(() => {
      const remainingMs = Math.max(0, endsAtRef.current - Date.now());
      setRemaining(Math.ceil(remainingMs / 1000));
      if (remainingMs <= 0 && intervalRef.current) {
        clearInterval(intervalRef.current);
        // Fires only on a natural countdown-to-zero — never on mount (first tick
        // is 1s in) and never on Skip (skip clears the interval first). In true
        // background JS is suspended, so the OS notification handles the alert.
        Vibration.vibrate(REST_DONE_PATTERN);
      }
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      appStateSub.remove();
    };
  }, [visible, restTime]);

  useEffect(() => {
    if (remaining === 0 && visible) {
      const t = setTimeout(onClose, 600);
      return () => clearTimeout(t);
    }
  }, [remaining, visible]);

  const skip = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    progress.value = 0;
    setRemaining(0);
    onClose();
  };

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: CIRCUMFERENCE * (1 - progress.value),
  }));

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const pct = restTime > 0 ? Math.round((remaining / restTime) * 100) : 0;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={skip}
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
              <Text style={styles.timerSub}>of {formatTime(restTime)} · {pct}%</Text>
            </View>
          </View>

          <View style={styles.hintRow}>
            <Ionicons name="barbell-outline" size={15} color="#444" />
            <Text style={styles.hintText}>Prepare for next set</Text>
          </View>

          <TouchableOpacity
            onPress={skip}
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
});
