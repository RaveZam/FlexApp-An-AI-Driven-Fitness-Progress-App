import { FontFamilies, Palette } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

type DayType = "restTR" | "completed" | "future" | "today";

export default function ScheduleBar() {

  const todayIdx = new Date().getDay();
  const [days] = useState([
    { name: "Sun", date: 17, type: "rest" as DayType },
    { name: "Mon", date: 11, type: "completed" as DayType },
    { name: "Tue", date: 12, type: "completed" as DayType },
    { name: "Wed", date: 13, type: "rest" as DayType },
    { name: "Thu", date: 14, type: "future" as DayType },
    { name: "Fri", date: 15, type: "future" as DayType },
    { name: "Sat", date: 16, type: "rest" as DayType },
  ]);

  const screenWidth = Dimensions.get("window").width;
  const circleSize = (screenWidth - 48 - 6 * 10) / 7;

  return (
    <Animated.View entering={FadeInDown.delay(60).duration(400)} style={styles.wrap}>
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>This Week</Text>
          <Text style={styles.title}>Rhythm</Text>
        </View>
        <View style={styles.legend}>
          <View style={styles.legendDot} />
          <Text style={styles.legendText}>2 / 4 done</Text>
        </View>
      </View>

      <View style={styles.weekTrack}>
        <View style={styles.baseline} />
        <View style={styles.weekRow}>
          {days.map((day, index) => {
            const isToday = index === todayIdx;
            const isCompleted = day.type === "completed";
            const isFuture = day.type === "future";

            return (
              <Animated.View
                key={day.name}
                entering={FadeInDown.delay(120 + index * 36).duration(400)}
                style={styles.dayCol}
              >
                <Text
                  style={[
                    styles.dayName,
                    {
                      color: isToday
                        ? Palette.accent
                        : isCompleted
                        ? Palette.bone
                        : Palette.mutedSoft,
                    },
                  ]}
                >
                  {day.name.toUpperCase()}
                </Text>
                <View
                  style={[
                    styles.dayCircle,
                    {
                      width: circleSize,
                      height: circleSize,
                      borderRadius: circleSize / 2,
                      backgroundColor: isCompleted ? Palette.accent : "transparent",
                      borderColor: isToday
                        ? Palette.accent
                        : isCompleted
                        ? Palette.accent
                        : isFuture
                        ? Palette.hairlineStrong
                        : Palette.hairline,
                    },
                  ]}
                >
                  {isCompleted ? (
                    <Ionicons name="checkmark" size={14} color={Palette.ink} />
                  ) : (
                    <Text
                      style={[
                        styles.dayNum,
                        {
                          color: isToday
                            ? Palette.accent
                            : isFuture
                            ? Palette.muted
                            : Palette.mutedSoft,
                        },
                      ]}
                    >
                      {day.date}
                    </Text>
                  )}
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
  eyebrow: {
    color: Palette.accent,
    fontSize: 9,
    fontFamily: FontFamilies.medium,
    letterSpacing: 2.4,
    textTransform: "uppercase",
    marginBottom: 4,
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
