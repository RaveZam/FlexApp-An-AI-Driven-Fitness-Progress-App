import { View } from "react-native";
import {
  VictoryAxis,
  VictoryChart,
  VictoryLine,
  VictoryTheme,
} from "victory-native";

export default function LineChart() {
  const DATA = [
    { x: 1, y: 40 },
    { x: 2, y: 45 },
    { x: 3, y: 42 },
    { x: 4, y: 43 },
    { x: 5, y: 45 },
    { x: 6, y: 48 },
  ];

  return (
    <View>
      <VictoryChart
        height={100}
        width={200}
        padding={{ left: 20, right: 20, top: 30, bottom: 10 }}
        theme={VictoryTheme.clean}
        domainPadding={{ x: 5, y: 4 }}
      >
        <VictoryAxis
          dependentAxis
          style={{
            axis: { stroke: "none" },
            ticks: { stroke: "none" },
            tickLabels: { fill: "none" },
          }}
        />

        <VictoryLine
          style={{
            data: {
              fill: "#1a472a",
              stroke: "#10b981",
              strokeWidth: 2,
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
