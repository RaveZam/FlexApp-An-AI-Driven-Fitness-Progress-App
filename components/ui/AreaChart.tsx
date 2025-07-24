import { View } from "react-native";
import {
  VictoryArea,
  VictoryAxis,
  VictoryChart,
  VictoryTheme,
} from "victory-native";

export default function MyChart() {
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
        padding={{ top: 20, bottom: 40 }}
        theme={VictoryTheme.clean}
        domainPadding={{ y: 20 }}
      >
        <VictoryAxis
          style={{
            axis: { stroke: "#10b981" }, // axis line
            tickLabels: {
              fill: "white", // tick text color
              fontSize: 16,
              opacity: 0.5,
            },
            grid: {
              stroke: "#ffffff",
              opacity: 0.07,
              strokeDasharray: "4, 4",
            },
          }}
        />
        <VictoryAxis
          dependentAxis
          style={{
            axis: { stroke: "#10b981" },
            tickLabels: {
              fill: "white",
              fontSize: 12,
              opacity: 0.3,
            },
            grid: {
              stroke: "#ffffff",
              opacity: 0.07,
              strokeDasharray: "4, 4",
            },
          }}
        />

        <VictoryArea
          style={{
            data: {
              fill: "#1a472a",
              stroke: "#10b981",
            },
          }}
          data={DATA}
          interpolation="natural"
          animate={{
            duration: 800,
          }}
        />
      </VictoryChart>
    </View>
  );
}
