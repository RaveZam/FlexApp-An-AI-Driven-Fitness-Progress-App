import { FontFamilies, Palette } from "@/constants/theme";
import { getWeekDates } from "@/src/features/home/helpers/weekDates";
import { useScheduleBar } from "@/src/features/home/hooks/useScheduleBar";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function ScheduleBar() {
  const { plannedDays, completedDays } = useScheduleBar();

  const today = new Date();
  const todayIdx = today.getDay();
  const weekDates = getWeekDates(today);

  const screenWidth = Dimensions.get("window").width;
  const circleSize = (screenWidth - 48 - 6 * 10) / 7;

  return (
    <Animated.View entering={FadeInDown.delay(60).duration(400)} style={styles.wrap}>
      <View style={styles.header}>
        <Text style={styles.title}>This Week</Text>
        <View style={styles.legend}>
          <View style={styles.legendDot} />
          <Text style={styles.legendText}>{plannedDays.size} days / week</Text>
        </View>
      </View>

      <View style={styles.weekTrack}>
        <View style={styles.baseline} />
        <View style={styles.weekRow}>
          {DAY_NAMES.map((name, index) => {
            const isToday = index === todayIdx;
            const isPlanned = plannedDays.has(index);
            const isCompleted = completedDays.has(index);
            const isMissed = isPlanned && index < todayIdx && !isCompleted;

            const nameColor = isCompleted
              ? Palette.accent
              : isMissed
              ? Palette.danger
              : isToday
              ? Palette.accent
              : isPlanned
              ? Palette.bone
              : Palette.mutedSoft;
            const borderColor = isCompleted
              ? Palette.accent
              : isMissed
              ? Palette.danger
              : isToday || isPlanned
              ? Palette.accent
              : Palette.hairline;
            const backgroundColor = isCompleted ? Palette.accent : "transparent";
            const numColor = isCompleted
              ? Palette.ink
              : isMissed
              ? Palette.danger
              : isToday
              ? Palette.accent
              : isPlanned
              ? Palette.bone
              : Palette.mutedSoft;

            return (
              <Animated.View
                key={name}
                entering={FadeInDown.delay(120 + index * 36).duration(400)}
                style={styles.dayCol}
              >
                <Text style={[styles.dayName, { color: nameColor }]}>
                  {name.toUpperCase()}
                </Text>
                <View
                  style={[
                    styles.dayCircle,
                    {
                      width: circleSize,
                      height: circleSize,
                      borderRadius: circleSize / 2,
                      borderColor,
                      backgroundColor,
                    },
                  ]}
                >
                  <Text style={[styles.dayNum, { color: numColor }]}>
                    {weekDates[index]}
                  </Text>
                </View>
                {isToday && <View style={styles.todayDot} />}
              </Animated.View>
            );
          })}
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 4,
    backgroundColor: "transparent",
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  title: {
    color: Palette.bone,
    fontSize: 22,
    fontFamily: FontFamilies.displayMedium,
    letterSpacing: -0.4,
  },
  legend: { flexDirection: "row", alignItems: "center", gap: 8, paddingBottom: 4 },
  legendDot: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: Palette.accent },
  legendText: {
    color: Palette.muted,
    fontSize: 10,
    fontFamily: FontFamilies.regular,
    letterSpacing: 1.4,
    textTransform: "uppercase",
  },
  weekTrack: { position: "relative", paddingBottom: 6 },
  baseline: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 18,
    height: StyleSheet.hairlineWidth,
    backgroundColor: Palette.hairline,
  },
  weekRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 6,
  },
  dayCol: { alignItems: "center", justifyContent: "center" },
  dayName: {
    fontSize: 9,
    fontFamily: FontFamilies.medium,
    letterSpacing: 1.6,
    marginBottom: 10,
  },
  dayCircle: {
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: "center",
    justifyContent: "center",
  },
  dayNum: {
    fontSize: 12,
    fontFamily: FontFamilies.displayMedium,
    fontVariant: ["tabular-nums"],
  },
  todayDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: Palette.accent,
    marginTop: 6,
  },
});
