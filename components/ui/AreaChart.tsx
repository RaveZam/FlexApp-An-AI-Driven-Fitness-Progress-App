import { Dimensions, View } from "react-native";
import { VictoryArea, VictoryAxis, VictoryChart } from "victory-native";
import { usePalette } from "@/src/theme";

export default function MyChart() {
  const p = usePalette();
  const DATA = [
    { x: 1, y: 10 },
    { x: 2, y: 15 },
    { x: 3, y: 12 },
    { x: 4, y: 25 },
    { x: 5, y: 18 },
    { x: 6, y: 30 },
    { x: 7, y: 22 },
    { x: 8, y: 10 },
    { x: 9, y: 15 },
    { x: 10, y: 12 },
    { x: 11, y: 25 },
    { x: 12, y: 18 },
    { x: 13, y: 30 },
    { x: 14, y: 22 },
  ];
  return (
    <View>
      <VictoryChart
        height={140}
        width={Dimensions.get("window").width - 60}
        padding={{ top: 20, bottom: 40 }}
        domainPadding={{ y: 20 }}
      >
        <VictoryAxis
          style={{
            tickLabels: {
              fill: p.bone,
              fontSize: 16,
              opacity: 0.5,
            },
            grid: {
              stroke: p.bone,
              opacity: 0.07,
              strokeDasharray: "4, 4",
            },
          }}
        />
        <VictoryAxis
          dependentAxis
          style={{
            tickLabels: {
              fill: p.bone,
              fontSize: 12,
              opacity: 0.3,
            },
            grid: {
              opacity: 0.07,
              strokeDasharray: "4, 4",
            },
          }}
        />
        <VictoryArea
          data={DATA}
          interpolation="natural"
          style={{
            data: {
              fill: p.accentDeep, // Emerald green fill

              strokeWidth: 2,
            },
          }}
        />
      </VictoryChart>
    </View>
  );
}
