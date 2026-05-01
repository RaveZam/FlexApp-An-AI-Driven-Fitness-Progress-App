import Feather from "@expo/vector-icons/Feather";
import React, { useMemo } from "react";
import { Dimensions, Text, View } from "react-native";
import Animated, {
  FadeInDown,
  FadeInUp,
  FadeIn,
} from "react-native-reanimated";
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
} from "victory-native";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const ACCENT = "#10b981";
const ACCENT_DIM = "rgba(16, 185, 129, 0.15)";
const CARD_BG = "#141414";
const SURFACE = "#1c1c1c";

export function HomePageChartGraph() {
  const screenWidth = Dimensions.get("window").width;

  // Mock data — daily volume in lbs for this week
  const dailyVolume = useMemo(
    () => [
      { day: "Mon", volume: 12400 },
      { day: "Tue", volume: 0 },
      { day: "Wed", volume: 15800 },
      { day: "Thu", volume: 9200 },
      { day: "Fri", volume: 18600 },
      { day: "Sat", volume: 0 },
      { day: "Sun", volume: 0 },
    ],
    []
  );

  const today = DAYS[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1];

  const totalVolume = dailyVolume.reduce((sum, d) => sum + d.volume, 0);
  const activeDays = dailyVolume.filter((d) => d.volume > 0).length;
  const avgVolume = activeDays > 0 ? Math.round(totalVolume / activeDays) : 0;

  const chartData = dailyVolume.map((d, i) => ({
    x: d.day,
    y: d.volume || 300, // give rest days a tiny sliver
    isRest: d.volume === 0,
    isToday: d.day === today,
    index: i,
  }));

  const formatVolume = (v: number) => {
    if (v >= 1000) return `${(v / 1000).toFixed(1).replace(/\.0$/, "")}k`;
    return `${v}`;
  };

  return (
    <Animated.View
      entering={FadeInDown.delay(250).springify().damping(18)}
      style={{
        marginHorizontal: 16,
        borderRadius: 20,
        backgroundColor: CARD_BG,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.05)",
      }}
    >
      {/* Gradient-like top edge */}
      <View
        style={{
          height: 2,
          flexDirection: "row",
          overflow: "hidden",
        }}
      >
        <View style={{ flex: 1, backgroundColor: ACCENT, opacity: 0.7 }} />
        <View style={{ flex: 1, backgroundColor: ACCENT, opacity: 0.4 }} />
        <View style={{ flex: 1, backgroundColor: ACCENT, opacity: 0.15 }} />
      </View>

      <View style={{ padding: 18, paddingBottom: 6 }}>
        {/* Header */}
        <Animated.View
          entering={FadeIn.delay(400).duration(500)}
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 4,
          }}
        >
          <View>
            <Text
              style={{
                color: "rgba(255,255,255,0.4)",
                fontSize: 11,
                fontFamily: "Inter_600SemiBold",
                letterSpacing: 1.5,
                textTransform: "uppercase",
                marginBottom: 4,
              }}
            >
              Weekly Volume
            </Text>
            <View style={{ flexDirection: "row", alignItems: "baseline", gap: 4 }}>
              <Text
                style={{
                  color: "#ffffff",
                  fontSize: 28,
                  fontFamily: "Inter_700Bold",
                  letterSpacing: -1,
                }}
              >
                {formatVolume(totalVolume)}
              </Text>
              <Text
                style={{
                  color: "rgba(255,255,255,0.25)",
                  fontSize: 14,
                  fontFamily: "Inter_400Regular",
                }}
              >
                lbs
              </Text>
            </View>
          </View>

          {/* Trend badge */}
          <Animated.View
            entering={FadeInUp.delay(600).springify()}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
              backgroundColor: ACCENT_DIM,
              paddingHorizontal: 10,
              paddingVertical: 5,
              borderRadius: 20,
            }}
          >
            <Feather name="trending-up" size={12} color={ACCENT} />
            <Text
              style={{
                color: ACCENT,
                fontSize: 12,
                fontFamily: "Inter_700Bold",
              }}
            >
              +8%
            </Text>
          </Animated.View>
        </Animated.View>

        {/* Bar Chart */}
        <View style={{ marginHorizontal: -8, marginTop: -2 }}>
          <VictoryChart
            width={screenWidth - 52}
            height={140}
            padding={{ top: 12, bottom: 36, left: 8, right: 8 }}
            domainPadding={{ x: 28, y: [0, 16] }}
          >
            {/* Hide dependent axis completely */}
            <VictoryAxis
              dependentAxis
              style={{
                axis: { stroke: "transparent" },
                tickLabels: { fill: "transparent" },
                grid: { stroke: "transparent" },
              }}
            />

            {/* Day labels */}
            <VictoryAxis
              style={{
                axis: { stroke: "transparent" },
                tickLabels: {
                  fill: ({ tick }: any) =>
                    tick === today ? ACCENT : "rgba(255,255,255,0.25)",
                  fontSize: 11,
                  fontFamily: "Inter_600SemiBold",
                  padding: 8,
                },
              }}
            />

            <VictoryBar
              data={chartData}
              x="x"
              y="y"
              cornerRadius={{ top: 6 }}
              barWidth={({ index }: any) => {
                const barCount = chartData.length;
                const availableWidth = screenWidth - 52 - 16 - 56;
                return Math.min((availableWidth / barCount) * 0.55, 30);
              }}
              style={{
                data: {
                  fill: ({ datum }: any) => {
                    if (datum.isRest) return "rgba(255,255,255,0.04)";
                    if (datum.isToday) return ACCENT;
                    return "rgba(255,255,255,0.10)";
                  },
                },
              }}
              animate={{
                duration: 800,
                onLoad: { duration: 600 },
              }}
            />
          </VictoryChart>
        </View>
      </View>

      {/* Bottom stats strip */}
      <View
        style={{
          flexDirection: "row",
          borderTopWidth: 1,
          borderTopColor: "rgba(255,255,255,0.04)",
        }}
      >
        <View
          style={{
            flex: 1,
            paddingVertical: 14,
            alignItems: "center",
            borderRightWidth: 1,
            borderRightColor: "rgba(255,255,255,0.04)",
          }}
        >
          <Text
            style={{
              color: "rgba(255,255,255,0.3)",
              fontSize: 10,
              fontFamily: "Inter_600SemiBold",
              letterSpacing: 0.8,
              textTransform: "uppercase",
              marginBottom: 3,
            }}
          >
            Avg / Session
          </Text>
          <Text
            style={{
              color: "#ffffff",
              fontSize: 16,
              fontFamily: "Inter_700Bold",
            }}
          >
            {formatVolume(avgVolume)}
            <Text
              style={{
                color: "rgba(255,255,255,0.2)",
                fontSize: 11,
                fontFamily: "Inter_400Regular",
              }}
            >
              {" "}lbs
            </Text>
          </Text>
        </View>

        <View
          style={{
            flex: 1,
            paddingVertical: 14,
            alignItems: "center",
            borderRightWidth: 1,
            borderRightColor: "rgba(255,255,255,0.04)",
          }}
        >
          <Text
            style={{
              color: "rgba(255,255,255,0.3)",
              fontSize: 10,
              fontFamily: "Inter_600SemiBold",
              letterSpacing: 0.8,
              textTransform: "uppercase",
              marginBottom: 3,
            }}
          >
            Sessions
          </Text>
          <Text
            style={{
              color: "#ffffff",
              fontSize: 16,
              fontFamily: "Inter_700Bold",
            }}
          >
            {activeDays}
            <Text
              style={{
                color: "rgba(255,255,255,0.2)",
                fontSize: 11,
                fontFamily: "Inter_400Regular",
              }}
            >
              {" "}/ 7
            </Text>
          </Text>
        </View>

        <View
          style={{
            flex: 1,
            paddingVertical: 14,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: "rgba(255,255,255,0.3)",
              fontSize: 10,
              fontFamily: "Inter_600SemiBold",
              letterSpacing: 0.8,
              textTransform: "uppercase",
              marginBottom: 3,
            }}
          >
            Best Day
          </Text>
          <Text
            style={{
              color: ACCENT,
              fontSize: 16,
              fontFamily: "Inter_700Bold",
            }}
          >
            {dailyVolume.reduce((best, d) => (d.volume > best.volume ? d : best), dailyVolume[0]).day}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
}
